#!/usr/bin/env node
// scripts/admin_manager_v1.js

// Requires: yarn add figlet boxen @prisma/client inquirer@8 inquirer-autocomplete-prompt bcrypt chalk@4 @faker-js/faker
const { PrismaClient } = require('@prisma/client');

// use direct require so Inquirer’s Prompt class is initialized correctly
const inquirer = require('inquirer');
const autocomplete = require('inquirer-autocomplete-prompt');
inquirer.registerPrompt('autocomplete', autocomplete.default || autocomplete);

const bcrypt = require('bcrypt');
const chalkImport = require('chalk');
const chalk = typeof chalkImport === 'function' ? chalkImport : chalkImport.default;
const figlet = require('figlet');
// boxen import fix:
const _boxen = require('boxen');
const boxen = _boxen.default || _boxen;
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();
const adminName = 'Irfan Korai';

function printHeader() {
  console.clear();
  const titleArt = figlet.textSync('SOLVERSE', { horizontalLayout: 'fitted' });
  const headerBox = boxen(titleArt, { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'green' });
  console.log(chalk.blue(headerBox));
  console.log(chalk.greenBright(`Welcome ${adminName},`));
  console.log(chalk.magenta('Admin Command Center for SOLVERSE\n'));
}

function fullName(u) {
  return `${u.firstName || ''} ${u.lastName || ''}`.trim();
}

async function chooseUser() {
  const { method } = await inquirer.prompt([
    { type: 'list', name: 'method', message: 'Locate user by:', choices: ['Select from recent users', 'Enter ID manually'] }
  ]);

  if (method === 'Select from recent users') {
    const { limit } = await inquirer.prompt([
      { type: 'input', name: 'limit', message: 'How many users to list?', default: 10, validate: i => i > 0 || 'Enter a valid number.' }
    ]);
    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
      take: parseInt(limit, 10),
      include: { referredBy: true, referrals: true, cryptoWallets: true, country: true, language: true, mainCurrency: true }
    });
    if (!users.length) { console.log(chalk.red('❌ No users found.')); return null; }
    console.table(users.map(u => ({
      id: u.id,
      email: u.email,
      fullName: fullName(u),
      role: u.role,
      status: u.status,
      country: u.country?.code || null,
      language: u.language?.code || null,
      currency: u.mainCurrency?.code || null,
      cryptoCount: u.cryptoWallets.length,
      referrals: u.referrals.length,
      createdAt: u.createdAt.toISOString()
    })));
    const { selectedId } = await inquirer.prompt([
      { type: 'list', name: 'selectedId', message: 'Select a user:', choices: users.map(u => ({ name: `${u.id} – ${u.email}`, value: u.id })) }
    ]);
    return selectedId;
  } else {
    const { userId } = await inquirer.prompt([
      { type: 'input', name: 'userId', message: 'Enter user ID:', validate: i => !isNaN(i) || 'Enter a valid user ID.' }
    ]);
    return parseInt(userId, 10);
  }
}

async function fetchUsers(limit) {
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' },
    take: limit,
    include: {
      referredBy: true,
      referrals: true,
      cryptoWallets: true,
      country: true,
      language: true,
      mainCurrency: true,
      role: true,
      status: true,
      accountStatus: true,
      verificationStatus: true,
      membershipStatus: true
    }
  });
  if (!users.length) {
    console.log(chalk.red('❌ No users found.'));
    return;
  }
  console.table(users.map(u => ({
    id:             u.id,
    email:          u.email,
    username:       u.username,
    fullName:       fullName(u),
    role:           u.role?.name || null,
    userStatus:     u.status?.name || null,
    accountStatus:  u.accountStatus?.name || null,
    verification:   u.verificationStatus?.name || null,
    membership:     u.membershipStatus?.name || null,
    country:        u.country?.name || null,
    language:       u.language?.name || null,
    currency:       u.mainCurrency?.code || null,
    cryptoCount:    u.cryptoWallets.length,
    referrals:      u.referrals.length,
    createdAt:      u.createdAt.toISOString(),
    updatedAt:      u.updatedAt.toISOString()
  })));
}

async function searchUserByEmail() {
  const { email } = await inquirer.prompt([
    { type: 'input', name: 'email', message: 'Enter email to search:', validate: e => e.includes('@') }
  ]);
  const u = await prisma.user.findUnique({
    where: { email },
    include: { referredBy: true, referrals: true, cryptoWallets: true, country: true, language: true, mainCurrency: true }
  });
  if (!u) { console.log(chalk.red('❌ No user found.')); return; }
  console.table([{
    id: u.id,
    email: u.email,
    username: u.username,
    fullName: fullName(u),
    role: u.role,
    status: u.status,
    accountStatus: u.accountStatus,
    userStatus: u.userStatus,
    membership: u.membershipStatus,
    country: u.country?.name || null,
    language: u.language?.name || null,
    currency: u.mainCurrency?.code || null,
    cryptoCount: u.cryptoWallets.length,
    referrals: u.referrals.length,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString()
  }]);
}

async function updatePassword() {
  const userId = await chooseUser();
  if (!userId) return;
  const { newPassword, confirmPassword } = await inquirer.prompt([
    { type: 'password', name: 'newPassword', message: 'New password:', mask: '*', validate: p => p.length >= 6 },
    { type: 'password', name: 'confirmPassword', message: 'Confirm password:', mask: '*', validate: p => p.length >= 6 }
  ]);
  if (newPassword !== confirmPassword) { console.log(chalk.red('❌ Passwords do not match.')); return; }
  const salt = await bcrypt.genSalt(10);
  await prisma.user.update({ where: { id: userId }, data: { password: await bcrypt.hash(newPassword, salt), salt } });
  console.log(chalk.green('✅ Password updated.'));
}

async function updateProfile() {
  const userId = await chooseUser();
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { country: true, language: true, mainCurrency: true, cryptoWallets: true, timezone: true, role: true, status: true, accountStatus: true, verificationStatus: true, membershipStatus: true }
  });
  if (!user) { console.log(chalk.red(`❌ User #${userId} not found.`)); return; }

  // fetch lookup tables
  const [countries, languages, currencies, cryptos, timezones,
         roles, userStatuses, accountStatuses, verificationStatuses, membershipStatuses] =
    await Promise.all([
      prisma.country.findMany(),
      prisma.language.findMany(),
      prisma.currency.findMany(),
      prisma.cryptocurrency.findMany(),
      prisma.timezone.findMany(),
      prisma.role.findMany({ where: { archived: false } }),
      prisma.userStatus.findMany({ where: { archived: false } }),
      prisma.accountStatus.findMany({ where: { archived: false } }),
      prisma.verificationStatus.findMany({ where: { archived: false } }),
      prisma.membershipStatus.findMany({ where: { archived: false } }),
    ]);

  const countryChoices   = countries.sort((a,b)=>a.name.localeCompare(b.name)).map(c => ({ name: c.name, value: c.id }));
  const languageChoices  = languages.sort((a,b)=>a.name.localeCompare(b.name)).map(l => ({ name: `${l.name} (${l.code})`, value: l.id }));
  const currencyChoices  = currencies.sort((a,b)=>a.name.localeCompare(b.name)).map(c => ({ name: `${c.name} (${c.code})`, value: c.id }));
  const cryptoChoices    = cryptos.sort((a,b)=>a.name.localeCompare(b.name)).map(c => ({ name: `${c.name} (${c.symbol})`, value: c.id }));
  const timezoneChoices  = timezones.sort((a,b)=>a.name.localeCompare(b.name)).map(tz => ({ name: tz.name, value: tz.id }));
  const roleChoices      = roles.map(r => ({ name: r.name, value: r.id }));
  const userStatusChoices       = userStatuses.map(s => ({ name: s.name, value: s.id }));
  const accountStatusChoices    = accountStatuses.map(s => ({ name: s.name, value: s.id }));
  const verificationChoices     = verificationStatuses.map(s => ({ name: s.name, value: s.id }));
  const membershipChoices       = membershipStatuses.map(s => ({ name: s.name, value: s.id }));

  const answers = await inquirer.prompt([
    { type: 'input',       name: 'username',            message: 'Username:',        default: user.username },
    { type: 'input',       name: 'firstName',           message: 'First Name:',      default: user.firstName || '' },
    { type: 'input',       name: 'lastName',            message: 'Last Name:',       default: user.lastName  || '' },
    { type: 'input',       name: 'email',               message: 'Email:',           default: user.email, validate: e => e.includes('@') },
    { type: 'input',       name: 'job',                 message: 'Job Title:',       default: user.job       || '' },
    { type: 'input',       name: 'contact',             message: 'Contact Info:',    default: user.contact   || '' },
    { type: 'input',       name: 'address',             message: 'Address:',         default: user.address   || '' },
    { type: 'input',       name: 'state',               message: 'State/Region:',    default: user.state     || '' },
    { type: 'input',       name: 'zipCode',             message: 'ZIP/Postal Code:', default: user.zipCode   || '' },

    { // existing lookups
      type: 'autocomplete',
      name: 'timezoneId',
      message: 'Timezone:',
      pageSize: 6,
      source: (_, input='') => timezoneChoices.filter(t => t.name.toLowerCase().includes(input.toLowerCase())),
      default: user.timezoneId
    },
    {
      type: 'autocomplete',
      name: 'countryId',
      message: 'Country:',
      pageSize: 6,
      source: (_, input='') => countryChoices.filter(c => c.name.toLowerCase().includes(input.toLowerCase())),
      default: user.countryId
    },
    {
      type: 'autocomplete',
      name: 'languageId',
      message: 'Language:',
      pageSize: 6,
      source: (_, input='') => languageChoices.filter(l => l.name.toLowerCase().includes(input.toLowerCase())),
      default: user.languageId
    },
    {
      type: 'autocomplete',
      name: 'currencyId',
      message: 'Currency:',
      pageSize: 6,
      source: (_, input='') => currencyChoices.filter(c => c.name.toLowerCase().includes(input.toLowerCase())),
      default: user.mainCurrencyId
    },
    {
      type: 'autocomplete',
      name: 'cryptoId',
      message: 'Primary Crypto:',
      pageSize: 6,
      source: (_, input='') => cryptoChoices.filter(c => c.name.toLowerCase().includes(input.toLowerCase())),
      default: user.cryptoWallets[0]?.cryptoId
    },

    // new status lookups
    {
      type: 'list',
      name: 'roleId',
      message: 'Role:',
      choices: roleChoices,
      default: user.roleId
    },
    {
      type: 'list',
      name: 'userStatusId',
      message: 'User Status:',
      choices: userStatusChoices,
      default: user.userStatusId
    },
    {
      type: 'list',
      name: 'accountStatusId',
      message: 'Account Status:',
      choices: accountStatusChoices,
      default: user.accountStatusId
    },
    {
      type: 'list',
      name: 'verificationStatusId',
      message: 'Verification Status:',
      choices: verificationChoices,
      default: user.verificationStatusId
    },
    {
      type: 'list',
      name: 'membershipStatusId',
      message: 'Membership Status:',
      choices: membershipChoices,
      default: user.membershipStatusId
    },

    { type: 'input', name: 'avatar',       message: 'Avatar URL:',       default: user.avatar    || '' },
    { type: 'input', name: 'headerPhoto',  message: 'Header Photo URL:',  default: user.headerPhoto|| '' },
    { type: 'input', name: 'about',        message: 'About / Bio:',      default: user.about     || '' },
    { type: 'input', name: 'referralCode', message: 'Referral Code:',    default: user.referralCode|| '' },
  ]);

  const updateData = {
    username:          answers.username,
    firstName:         answers.firstName,
    lastName:          answers.lastName,
    email:             answers.email,
    job:               answers.job,
    contact:           answers.contact,
    address:           answers.address,
    state:             answers.state,
    zipCode:           answers.zipCode,
    avatar:            answers.avatar,
    headerPhoto:       answers.headerPhoto,
    about:             answers.about,
    referralCode:      answers.referralCode,
    timezone:          { connect: { id: answers.timezoneId } },
    country:           { connect: { id: answers.countryId } },
    language:          { connect: { id: answers.languageId } },
    mainCurrency:      { connect: { id: answers.currencyId } },
    // crypto wallet handled below...
    role:              { connect: { id: answers.roleId } },
    status:            { connect: { id: answers.userStatusId } },
    accountStatus:     { connect: { id: answers.accountStatusId } },
    verificationStatus:{ connect: { id: answers.verificationStatusId } },
    membershipStatus:  { connect: { id: answers.membershipStatusId } },
  };

  const existingWallet = user.cryptoWallets[0];
  if (answers.cryptoId != null) {
    updateData.cryptoWallets = existingWallet
      ? { update: { where: { id: existingWallet.id }, data: { cryptoId: answers.cryptoId } } }
      : { create: { cryptoId: answers.cryptoId, address: faker.finance.bitcoinAddress() } };
  }

  await prisma.user.update({ where: { id: userId }, data: updateData });
  console.log(chalk.green(`✅ User #${userId} profile updated.`));
}

async function createRandomAdmin() {
  const password = faker.internet.password(10);
  const salt     = await bcrypt.genSalt(10);
  const hash     = await bcrypt.hash(password, salt);

  const [countryCount, languageCount, currencyCount] = await Promise.all([
    prisma.country.count(),
    prisma.language.count(),
    prisma.currency.count()
  ]);
  const country  = await prisma.country.findFirst({ skip: faker.number.int({ min: 0, max: countryCount - 1 }) });
  const language = await prisma.language.findFirst({ skip: faker.number.int({ min: 0, max: languageCount - 1 }) });
  const currency = await prisma.currency.findFirst({ skip: faker.number.int({ min: 0, max: currencyCount - 1 }) });

  const user = await prisma.user.create({
    data: {
      email:            faker.internet.email(),
      username:         faker.internet.userName(),
      firstName:        faker.name.firstName(),
      lastName:         faker.name.lastName(),
      password:         hash,
      salt,
      role:             'ADMIN',
      status:           'ACTIVE',
      accountStatus:    'ACTIVE',
      userStatus:       'VERIFIED',
      membershipStatus: 'GUEST',
      country:          country   ? { connect: { id: country.id } }   : undefined,
      language:         language  ? { connect: { id: language.id } }  : undefined,
      mainCurrency:     currency  ? { connect: { id: currency.id } }  : undefined
    }
  });

  console.log(chalk.green('✅ Random admin created!'));
  console.log(chalk.yellow(`Email: ${user.email}\nPassword: ${password}`));
}

async function deleteUser() {
  const userId = await chooseUser();
  if (!userId) return;
  const { confirm } = await inquirer.prompt([
    { type: 'confirm', name: 'confirm', message: `Are you sure you want to delete user #${userId}?`, default: false }
  ]);
  if (!confirm) { console.log(chalk.yellow('Deletion cancelled.')); return; }
  await prisma.user.delete({ where: { id: userId } });
  console.log(chalk.green('✅ User deleted.'));
}

(async () => {
  printHeader();
  while (true) {
    const { action } = await inquirer.prompt([{
      type: 'list', name: 'action', message: 'Select an action:',
      choices: [
        'Get users',
        'Search user by email',
        'Update password',
        'Update profile',
        'Create random admin',
        'Delete user',
        new inquirer.Separator(),
        'Exit'
      ]
    }]);

    switch (action) {
      case 'Get users': {
        const { limit } = await inquirer.prompt([{ type: 'input', name: 'limit', message: 'How many to fetch?', default: 5, validate: i => i > 0 }]);
        await fetchUsers(parseInt(limit, 10));
        break;
      }
      case 'Search user by email':
        await searchUserByEmail(); break;
      case 'Update password':
        await updatePassword(); break;
      case 'Update profile':
        await updateProfile(); break;
      case 'Create random admin':
        await createRandomAdmin(); break;
      case 'Delete user':
        await deleteUser(); break;
      case 'Exit':
        console.log('👋 Goodbye!');
        await prisma.$disconnect();
        process.exit(0);
    }
  }
})();
