#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const chalkModule = require("chalk");
const { createPromptModule } = require("inquirer");

const chalk = chalkModule.default || chalkModule;
const prompt = createPromptModule();

let backupDir = path.resolve(__dirname, "..", "db_backups");
try {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(chalk.green(`✔ Backup folder ready: ${backupDir}`));
} catch {
  console.warn(chalk.yellow(`⚠️  Could not prepare backups folder; using current directory.`));
  backupDir = process.cwd();
}

// List all user-created databases
function listDatabases() {
  const cmd = `psql "postgresql://medlobby_user:irfan998@localhost:5432/postgres" -Atc "SELECT datname FROM pg_database WHERE datistemplate = false;"`;
  const out = execSync(cmd, { encoding: "utf8" });
  return out.trim().split("\n").filter((d) => d);
}

// List backup files in the backups folder
function listBackupFiles() {
  return fs.readdirSync(backupDir).filter(f => f.endsWith(".sql"));
}

async function takeBackup() {
  try {
    const databases = listDatabases();
    const { dbName, schema, filename } = await prompt([
      {
        type: "list",
        name: "dbName",
        message: "Select database to back up:",
        choices: databases,
      },
      {
        type: "input",
        name: "schema",
        message: "Schema (leave blank for entire DB):",
      },
      {
        type: "input",
        name: "filename",
        message: `Output file name (in ${backupDir}/):`,
        default: `backup_${dayjs().format("YYYY-MM-DD_HH-mm-ss")}.sql`,
      },
    ]);

    const outputPath = path.join(backupDir, filename);
    const baseCmd = schema ? `pg_dump -n ${schema}` : `pg_dump`;
    const cmd = `${baseCmd} "postgresql://medlobby_user:irfan998@localhost:5432/${dbName}" > "${outputPath}"`;

    console.log(chalk.blue(`Running: ${cmd}`));
    execSync(cmd, { stdio: "inherit", shell: "/bin/bash" });

    console.log(chalk.green(`✔ Backup saved to ${outputPath}`));
  } catch (err) {
    console.error(chalk.red("✖ Backup failed:"), err.message);
  }
}

async function restoreBackup() {
  try {
    const databases = listDatabases();
    const backupFiles = listBackupFiles();

    if (backupFiles.length === 0) {
      console.log(chalk.yellow("⚠️  No backup files found."));
      return;
    }

    const { dbName, file } = await prompt([
      {
        type: "list",
        name: "dbName",
        message: "Select database to restore into:",
        choices: databases,
      },
      {
        type: "list",
        name: "file",
        message: "Select backup file to restore:",
        choices: backupFiles,
      },
    ]);

    const filePath = path.join(backupDir, file);

    const cmd = `psql "postgresql://medlobby_user:irfan998@localhost:5432/${dbName}" -f "${filePath}"`;

    console.log(chalk.blue(`Running: ${cmd}`));
    execSync(cmd, { stdio: "inherit", shell: "/bin/bash" });

    console.log(chalk.green(`✔ Restore completed from ${filePath}`));
  } catch (err) {
    console.error(chalk.red("✖ Restore failed:"), err.message);
  }
}

async function createDatabase() {
  try {
    const { dbName } = await prompt([
      {
        type: "input",
        name: "dbName",
        message: "Enter new database name:",
        validate: (val) => val.trim() !== "" || "Database name cannot be empty",
      },
    ]);

    const cmd = `createdb -U postgres -h localhost -p 5432 ${dbName}`;
    console.log(chalk.blue(`Running: ${cmd}`));
    execSync(cmd, { stdio: "inherit", shell: "/bin/bash" });

    console.log(chalk.green(`✔ Database '${dbName}' created successfully.`));
  } catch (err) {
    console.error(chalk.red("✖ Database creation failed:"), err.message);
  }
}

async function main() {
  while (true) {
    const { action } = await prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: ["Take backup", "Restore backup", "Create database", "Exit"],
      },
    ]);

    if (action === "Take backup") await takeBackup();
    else if (action === "Restore backup") await restoreBackup();
    else if (action === "Create database") await createDatabase();
    else break;
  }
}

main();
