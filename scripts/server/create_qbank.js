// scripts/create_qbank.js
// Simple CommonJS script — no import/export
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const qbank = await prisma.qbank.create({
    data: {
      name: 'Clinical Medicine',
      description: 'Main collection for tests',
    },
  });
  console.log('Created qbank:', qbank);
}

main()
  .catch(err => {
    console.error('Error:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
