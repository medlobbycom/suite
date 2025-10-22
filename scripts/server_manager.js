#!/usr/bin/env node

// Chalk v5+ under CommonJS
const chalk = require('chalk');

// Inquirer (CJS)
const inquirer = require('inquirer');
const Separator = inquirer.Separator;

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Predefined commands & session names
const predefinedCommands = [
  'yarn start',
  'yarn build && yarn start',
  'pnpm start',
  'npm start',
  'yarn dev',
  'yarn build',
  'rm -rf node_modules && rm -rf .next && yarn cache clean && yarn install && yarn build && yarn start',
  'pnpm dev',
  'rm -rf node_modules && rm -rf .next && pnpm install && pnpm lint --fix && pnpm build && pnpm start',
  'npm run build',
  'npm run dev'
];
const predefinedSessionNames = ['frontend', 'backend', 'admin', 'user'];

/** Helper: make session name safe for tmux (no spaces/shell meta) */
function sanitizeSessionName(name) {
  return name.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 64) || 'session';
}

/** Helper: check if tmux exists */
function isTmuxInstalled() {
  return new Promise(resolve => {
    exec('tmux -V', (err, stdout, stderr) => {
      if (err) return resolve(false);
      resolve(true);
    });
  });
}

// Interactive directory selector
async function selectDirectoryInteractive(baseDir = '/var/www') {
  let current = baseDir;
  while (true) {
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .sort();
    } catch (e) {
      console.log(chalk.yellow(`Cannot read directory ${current}: ${e.message}`));
      current = path.dirname(current);
      continue;
    }

    const choices = [];
    // option to choose current
    choices.push({ name: '✔ Select this directory', value: ':' });
    // parent
    if (path.resolve(current) !== path.resolve(baseDir)) {
      choices.push({ name: '.. (go up)', value: '..' });
    }
    // subfolders
    entries.forEach(name => choices.push({ name, value: name }));

    const { dirChoice } = await inquirer.prompt([{
      type: 'list',
      name: 'dirChoice',
      message: `Current: ${current}\nSelect a folder:`,
      choices
    }]);

    if (dirChoice === ':') {
      return current;
    }
    if (dirChoice === '..') {
      current = path.dirname(current);
    } else {
      current = path.join(current, dirChoice);
    }
  }
}

async function selectSessionName() {
  const { sessionName } = await inquirer.prompt([{
    type: 'list',
    name: 'sessionName',
    message: 'Select session name:',
    choices: [...predefinedSessionNames, 'Custom']
  }]);
  if (sessionName === 'Custom') {
    const { customName } = await inquirer.prompt([{
      type: 'input',
      name: 'customName',
      message: 'Enter custom session name:',
      validate: input => input.trim() !== '' || 'Session name cannot be empty.'
    }]);
    return sanitizeSessionName(customName.trim());
  }
  return sanitizeSessionName(sessionName);
}

async function selectCommand() {
  const { command } = await inquirer.prompt([{
    type: 'list',
    name: 'command',
    message: 'Select command to run:',
    choices: [...predefinedCommands, 'Custom']
  }]);
  if (command === 'Custom') {
    const { customCmd } = await inquirer.prompt([{
      type: 'input',
      name: 'customCmd',
      message: 'Enter custom command to run:',
      validate: input => input.trim() !== '' || 'Command cannot be empty.'
    }]);
    return customCmd.trim();
  }
  return command;
}

async function selectPort() {
  const { port } = await inquirer.prompt([{
    type: 'input',
    name: 'port',
    message: 'Enter port (leave blank for default):'
  }]);
  return (port || '').trim();
}

async function listTmuxSessions() {
  return new Promise(resolve => {
    exec('tmux ls', (err, stdout, stderr) => {
      // If tmux server isn't running, tmux ls usually returns an error like
      // "failed to connect to server" or "no server running"
      if (err) {
        // treat "no server" as empty list
        const combined = (stderr || '') + (stdout || '');
        if (/failed to connect to server|no server running|no server/i.test(combined)) {
          return resolve([]);
        }
        // for any other error, print it for debugging and return empty
        console.log(chalk.red('tmux ls error:'), combined.trim());
        return resolve([]);
      }
      if (!stdout) return resolve([]);
      const sessions = stdout
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.split(':')[0]);
      resolve(sessions);
    });
  });
}

async function panel() {
  // quick tmux check
  const hasTmux = await isTmuxInstalled();
  if (!hasTmux) {
    console.log(chalk.red('tmux not found on this machine. Please install tmux and re-run.'));
    console.log(chalk.gray('Ubuntu/Debian: sudo apt update && sudo apt install tmux'));
    console.log(chalk.gray('CentOS/RHEL: sudo yum install tmux'));
    // we still allow the interactive tool to run, but tmux operations will no-op.
  }

  while (true) {
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Select action:',
      choices: [
        'Start Service',
        'Stop Service',
        'Restart Service',
        'Check Status',
        'View Session Content',
        new Separator(),
        'Exit'
      ]
    }]);

    if (action === 'Exit') {
      console.log(chalk.blue('Goodbye!'));
      process.exit(0);
    }

    if (action === 'Start Service') {
      const name     = await selectSessionName();
      const port     = await selectPort();
      const command  = await selectCommand();
      const workDir  = await selectDirectoryInteractive();
      const prefix   = port ? `PORT=${port} ` : '';
      const fullCmd  = `cd ${workDir} && ${prefix}${command}`;

      console.log(chalk.green(`Starting session "${name}" in ${workDir} with: ${fullCmd}`));

      if (!hasTmux) {
        console.log(chalk.red('✖ tmux not available. Cannot start session.'));
        continue;
      }

      // Use bash -lc "..." to ensure cd && exports && commands run as expected
      // escape any double quotes in the command
      const escaped = fullCmd.replace(/(["\\$`!])/g, '\\$1');
      const tmuxCmd = `tmux new-session -d -s ${name} bash -lc "${escaped}"`;

      exec(tmuxCmd, (err, stdout, stderr) => {
        if (err) {
          console.log(chalk.red(`✖ Failed to start "${name}".`));
          if (stderr) console.log(chalk.red('stderr:'), stderr.trim());
          if (stdout) console.log(chalk.gray('stdout:'), stdout.trim());
        } else {
          console.log(chalk.green(`✅ "${name}" started.`));
        }
      });
    }

    else if (action === 'Stop Service') {
      const sessions = await listTmuxSessions();
      if (!sessions.length) {
        console.log(chalk.yellow('No tmux sessions found.'));
      } else {
        const { selected } = await inquirer.prompt([{ type: 'list', name: 'selected', message: 'Select session to stop:', choices: sessions }]);
        exec(`tmux kill-session -t ${selected}`, (err, stdout, stderr) => {
          if (err) console.log(chalk.red(`✖ Failed to stop "${selected}". ${stderr || ''}`));
          else console.log(chalk.green(`✅ "${selected}" stopped.`));
        });
      }
    }

    else if (action === 'Restart Service') {
      const sessions = await listTmuxSessions();
      if (!sessions.length) {
        console.log(chalk.yellow('No tmux sessions found.'));
      } else {
        const { selected } = await inquirer.prompt([{ type: 'list', name: 'selected', message: 'Select session to restart:', choices: sessions }]);
        exec(`tmux kill-session -t ${selected}`, async (err, stdout, stderr) => {
          if (err) {
            console.log(chalk.red(`✖ Failed to stop "${selected}". ${stderr || ''}`));
          } else {
            const { restartCmd } = await inquirer.prompt([{ type: 'input', name: 'restartCmd', message: `Enter command to restart "${selected}":`, validate: i => i.trim() !== '' || 'Command cannot be empty.' }]);
            const escaped = restartCmd.trim().replace(/(["\\$`!])/g, '\\$1');
            exec(`tmux new-session -d -s ${selected} bash -lc "${escaped}"`, (err2, out2, errOut2) => {
              if (err2) console.log(chalk.red(`✖ Failed to restart "${selected}". ${errOut2 || ''}`));
              else console.log(chalk.green(`✅ "${selected}" restarted.`));
            });
          }
        });
      }
    }

    else if (action === 'Check Status') {
      const sessions = await listTmuxSessions();
      if (!sessions.length) console.log(chalk.yellow('No tmux sessions found.'));
      else { console.log(chalk.blue('🖥 Active sessions:')); sessions.forEach(s => console.log(`- ${s}`)); }
    }

    else if (action === 'View Session Content') {
      const sessions = await listTmuxSessions();
      if (!sessions.length) console.log(chalk.yellow('No tmux sessions found.'));
      else {
        const { selected } = await inquirer.prompt([{ type: 'list', name: 'selected', message: 'Select session to view content:', choices: sessions }]);
        console.log(chalk.blue(`\n── Content of session "${selected}" ──\n`));
        // capture last 2000 lines of pane for visibility (-S -2000)
        exec(`tmux capture-pane -pt ${selected} -S -2000`, (err, stdout, stderr) => {
          if (err) {
            console.log(chalk.red(`✖ Failed to capture pane for "${selected}". ${stderr || ''}`));
          } else {
            console.log(stdout || chalk.gray('[no output]'));
          }
        });
      }
    }

    // tiny delay so console output finishes before re-prompt
    await new Promise(res => setTimeout(res, 100));
  }
}

panel().catch(err => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});
