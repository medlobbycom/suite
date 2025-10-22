// st.js

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import figlet from 'figlet';
import boxen from 'boxen';
import { spawn } from 'child_process';

// Dynamically import chalk to handle ES Module compatibility
const chalkModule = await import('chalk');
const chalk = chalkModule.default;

// Destructure chalk methods for convenience
const { red, green, yellow, cyan, blue, gray, greenBright } = chalk;

// Render ASCII banner and header
function printHeader() {
  console.clear();
  const titleArt = figlet.textSync('SOLVERSE', { horizontalLayout: 'fitted' });
  const headerBox = boxen(titleArt, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green'
  });
  console.log(blue(headerBox));
  console.log(greenBright('Welcome to the Script Runner!'));
}

// Generate a random alphanumeric string of given length
function generateRandomString(length = 30) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to start the dynamic line
function startDynamicLine() {
  const interval = setInterval(() => {
    process.stdout.write('\x1B[1F'); // Move cursor up one line
    process.stdout.write('\x1B[2K'); // Clear the line
    console.log(gray(generateRandomString(30)));
  }, 100);
  return interval;
}

async function main() {
  printHeader();
  console.log(); // Add an empty line for the dynamic line

  // Start the dynamic bottom line
  const ticker = startDynamicLine();

  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir) || !fs.statSync(scriptsDir).isDirectory()) {
    clearInterval(ticker);
    console.error(red('✖ Cannot find a "scripts" directory in the current folder.'));
    process.exit(1);
  }

  const allScripts = fs.readdirSync(scriptsDir)
    .filter(f => f.endsWith('.js'))
    .sort();

  if (allScripts.length === 0) {
    clearInterval(ticker);
    console.log(yellow('ℹ No .js files found in scripts/. Nothing to run.'));
    process.exit(0);
  }

  // Prompt user to pick one
  const { chosen } = await inquirer.prompt([{
    type: 'list',
    name: 'chosen',
    message: 'Which script do you want to run?',
    choices: [
      ...allScripts,
      new inquirer.Separator(),
      { name: '❌ Exit', value: null }
    ],
  }]);

  // Stop the dynamic line
  clearInterval(ticker);
  console.log(); // Move to the next line

  if (!chosen) {
    console.log(cyan('Bye!'));
    process.exit(0);
  }

  const scriptPath = path.join(scriptsDir, chosen);
  console.log(green(`▶ Running: node scripts/${chosen}\n`));

  const child = spawn('node', [scriptPath], {
    stdio: 'inherit'
  });

  child.on('exit', code => {
    if (code === 0) {
      console.log(green(`\n✔ Script "${chosen}" finished successfully.`));
    } else {
      console.error(red(`\n✖ Script "${chosen}" exited with code ${code}.`));
    }
    process.exit(code);
  });
}

main().catch(err => {
  console.error(red('✖ Error:'), err);
  process.exit(1);
});
