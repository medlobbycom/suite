// admin_backup_tool_files_all.js

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import dayjs from 'dayjs';
import archiver from 'archiver';
import unzipper from 'unzipper';
import { sync as globSync } from 'glob';
import { exec, spawn } from 'child_process';

// Helper to run shell commands with async/await (uses exec, good for commands with small output)
function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve(stdout);
    });
  });
}

// Helper to run shell commands by streaming (useful for large output)
function runCommandSpawn(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    proc.stdout.on('data', chunk => process.stdout.write(chunk));
    proc.stderr.on('data', chunk => process.stderr.write(chunk));
    proc.on('close', code => {
      if (code !== 0) return reject(new Error(`${command} exited with code ${code}`));
      resolve();
    });
  });
}

// Check if a module is installed
function isModuleInstalled(name) {
  try { require.resolve(name); return true; } catch { return false; }
}

// Install missing dependencies
async function installMissingDependencies() {
  const required = ['archiver', 'inquirer', 'chalk', 'dayjs', 'unzipper', 'glob', 'yauzl'];
  const missing = required.filter(m => !isModuleInstalled(m));
  if (!missing.length) return;

  console.log(chalk.yellow(`Missing: ${missing.join(', ')}`));
  const { install } = await inquirer.prompt({
    type: 'confirm',
    name: 'install',
    message: 'Install missing dependencies?',
    default: true,
  });
  if (!install) {
    console.log(chalk.yellow('⚠ Skipping dependency installation.'));
    return;
  }

  const { packageManager } = await inquirer.prompt({
    type: 'list',
    name: 'packageManager',
    message: 'Which package manager?',
    choices: ['npm', 'yarn', 'pnpm'],
    default: 'yarn',
  });
  const cmd = packageManager === 'npm'
    ? 'npm install'
    : packageManager === 'yarn'
      ? 'yarn add'
      : 'pnpm add';

  await runCommand(`${cmd} ${missing.join(' ')}`);
  console.log(chalk.green('Dependencies installed successfully!'));
}

// Ensure backups directory exists
function ensureBackupFolder() {
  const backupsDir = path.join(process.cwd(), 'backups');
  fs.mkdirSync(backupsDir, { recursive: true });
  console.log(chalk.green(`✔ Backup folder ready: ${backupsDir}`));
  return backupsDir;
}

// Zip a folder with live feedback, then optionally copy the zip elsewhere
async function zipFilesAndMove() {
  const backupsDir = ensureBackupFolder();
  const defaults = ['node_modules', 'backups', '.next', 'scripts'];

  // Prompt for folder to zip
  const { folderToZip } = await inquirer.prompt([{
    type: 'input',
    name: 'folderToZip',
    message: 'Directory to zip (default = current):',
    default: process.cwd()
  }]);

  // Prompt for folders to exclude
  const { excludeFolders } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'excludeFolders',
    message: 'Select folders to exclude:',
    choices: () =>
      fs.readdirSync(folderToZip)
        .filter(name => fs.statSync(path.join(folderToZip, name)).isDirectory())
        .map(name => ({ name, checked: defaults.includes(name) }))
  }]);

  // Build ignore patterns for archiver
  const ignorePatterns = excludeFolders.flatMap(f => [f, `${f}/**`, `**/${f}`, `**/${f}/**`]);
  const zipFileName = `backup_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`;
  const zipFilePath = path.join(backupsDir, zipFileName);

  console.log(chalk.green(`✔ Zipping: ${folderToZip}`));

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Log each entry's full disk path
    archive.on('entry', entry => {
      const fullPath = path.join(folderToZip, entry.name);
      console.log(chalk.blue(`➤ Adding: ${fullPath}`));
    });

    // Periodic progress updates
    let lastLogged = Date.now();
    archive.on('progress', stats => {
      const now = Date.now();
      if (now - lastLogged >= 1000) {
        console.log(chalk.green(
          `Progress: ${stats.entries.processed}/${stats.entries.total} files, ` +
          `${Math.round(stats.fs.processedBytes / 1024)} KB`
        ));
        lastLogged = now;
      }
    });

    archive.on('error', err => reject(err));
    output.on('close', () => resolve());

    archive.pipe(output);
    archive.glob(['**/*', '**/.*'], { cwd: folderToZip, ignore: ignorePatterns, dot: true });
    archive.finalize();
  });

  console.log(chalk.green(`✔ Zip created: ${zipFilePath}`));

  // Optionally copy ZIP to projects
  const { copyZip } = await inquirer.prompt({
    type: 'confirm',
    name: 'copyZip',
    message: 'Copy this zip into /root/projects/<subpath>?',
    default: true
  });
  if (copyZip) {
    const { subpath } = await inquirer.prompt([{
      type: 'input',
      name: 'subpath',
      message: 'Enter project subpath under /root/projects:',
      default: 'v1/backend'
    }]);
    const targetDir = path.join('/root/projects', subpath);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(zipFilePath, path.join(targetDir, zipFileName));
    console.log(chalk.green(`✔ Zip copied to: ${targetDir}`));
  }
}

// Unzip a file, verify integrity, extract files, then archive the original
async function unzipFileAndMove() {
  const backupsDir = ensureBackupFolder();
  const files = globSync(path.join(backupsDir, 'backup_*.zip'));
  if (!files.length) {
    console.error(chalk.red('✖ No backup ZIPs found!'));
    process.exit(1);
  }

  files.sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime);
  const { zipFilePath: chosenZip } = await inquirer.prompt([{
    type: 'input',
    name: 'zipFilePath',
    message: 'ZIP to unzip (default = most recent):',
    default: files[0]
  }]);
  if (!fs.existsSync(chosenZip)) {
    console.error(chalk.red(`✖ Zip not found: ${chosenZip}`));
    process.exit(1);
  }

  const { useProjects } = await inquirer.prompt([{
    type: 'confirm',
    name: 'useProjects',
    message: 'Unzip into /root/projects/<subpath>?',
    default: true
  }]);
  const baseDir = useProjects
    ? path.join('/root/projects', (await inquirer.prompt([{
        type: 'input',
        name: 'subpath',
        message: 'Enter project subpath under /root/projects:',
        default: 'v1/backend'
      }])).subpath)
    : (await inquirer.prompt([{
        type: 'input',
        name: 'destinationFolder',
        message: 'Enter destination folder (absolute path):',
        default: process.cwd()
      }])).destinationFolder;

  // Integrity check using spawn to stream output
  try {
    console.log(chalk.blue('📦 Verifying archive integrity...'));
    await runCommandSpawn('unzip', ['-t', chosenZip]);
    console.log(chalk.green('✔ Integrity check passed'));
  } catch (err) {
    console.error(chalk.red('✖ ZIP integrity test failed. The archive may be corrupted.'));
    console.error(chalk.red(err));
    process.exit(1);
  }

  fs.mkdirSync(baseDir, { recursive: true });
  const projectBackupDir = path.join(baseDir, 'backups');
  fs.mkdirSync(projectBackupDir, { recursive: true });
  console.log(chalk.green(`✔ Extracting all files into: ${baseDir}`));

  fs.createReadStream(chosenZip)
    .pipe(unzipper.Parse())
    .on('entry', entry => {
      console.log(chalk.blue(`➤ Extracting: ${entry.path}`));
      const fullPath = path.join(baseDir, entry.path);
      if (entry.type === 'Directory') {
        fs.mkdirSync(fullPath, { recursive: true });
        entry.autodrain();
      } else {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        entry.pipe(fs.createWriteStream(fullPath));
      }
    })
    .on('close', () => {
      fs.renameSync(chosenZip, path.join(projectBackupDir, path.basename(chosenZip)));
      console.log(chalk.green('✔ Unzip complete and original moved to backups'));
    })
    .on('error', err => {
      console.error(chalk.red(`✖ Unzip failed: ${err.message}`));
      process.exit(1);
    });
}

// Main entry point
async function main() {
  // **NEW** Prompt only once at startup to skip entire dependency check if desired
  const { checkDeps } = await inquirer.prompt([{
    type: 'confirm',
    name: 'checkDeps',
    message: 'Check/install dependencies? (Y/n)',
    default: true
  }]);
  if (checkDeps) {
    await installMissingDependencies();
  } else {
    console.log(chalk.yellow('⚠ Skipping dependency check entirely.'));
  }

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: ['Zip files', 'Unzip file', 'Exit'],
    default: 'Zip files'
  }]);

  if (action === 'Zip files') {
    await zipFilesAndMove();
  } else if (action === 'Unzip file') {
    await unzipFileAndMove();
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error(chalk.red(`✖ Error: ${err}`));
  process.exit(1);
});
