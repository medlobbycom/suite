// scripts/clear_questions.js
// SAFE USAGE:
//   # Delete ALL questions (and their attempts) - requires CONFIRM=1
//   CONFIRM=1 node scripts/clear_questions.js
//
//   # Delete only questions in qbankId=1:
//   CONFIRM=1 QBANK_ID=1 node scripts/clear_questions.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    if (process.env.CONFIRM !== '1') {
      console.error('Abort: set CONFIRM=1 to actually delete rows.');
      process.exit(1);
    }

    const qbankId = process.env.QBANK_ID ? parseInt(process.env.QBANK_ID, 10) : null;

    if (qbankId) {
      console.log(`Deleting attempts -> questions for qbankId=${qbankId} ...`);
      // 1) find question ids for that qbank
      const qrows = await prisma.question.findMany({ where: { qbankId }, select: { id: true } });
      const qids = qrows.map(r => r.id);
      if (qids.length === 0) {
        console.log('No questions found for that qbank.');
        await prisma.$disconnect();
        return process.exit(0);
      }

      // 2) delete attempts referencing those questions
      const delAttempts = await prisma.userQuestionAttempt.deleteMany({ where: { questionId: { in: qids } } });
      console.log('Deleted attempts:', delAttempts.count);

      // 3) delete the questions
      const delQs = await prisma.question.deleteMany({ where: { id: { in: qids } } });
      console.log('Deleted questions:', delQs.count);

      await prisma.$disconnect();
      console.log('Done.');
      return process.exit(0);
    }

    // DELETE ALL
    console.log('Deleting ALL UserQuestionAttempt rows ...');
    const delAllAttempts = await prisma.userQuestionAttempt.deleteMany({});
    console.log('Deleted attempts:', delAllAttempts.count);

    console.log('Deleting ALL questions ...');
    const delAllQs = await prisma.question.deleteMany({});
    console.log('Deleted questions:', delAllQs.count);

    await prisma.$disconnect();
    console.log('Done.');
    process.exit(0);

  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
