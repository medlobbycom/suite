'use client';
import Link from 'next/link';

interface Attempt {
  questionId: number;
  isCorrect: boolean;
}

interface Props {
  sessionId: string;
  questionIds: number[];
  currentQuestionNumber: number;
  attempts: Attempt[];
  basePath: string;
  mode: 'live' | 'review';
}

export default function QuestionNavigator({ sessionId, questionIds, currentQuestionNumber, attempts, basePath, mode }: Props) {
  const getStatusClass = (questionId: number, index: number) => {
    const attempt = attempts.find(a => a.questionId === questionId);
    if (index + 1 === currentQuestionNumber) {
      return 'bg-indigo-600 text-white ring-2 ring-white/75';
    }
    if (attempt) {
      return attempt.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    }
    return 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
  };
  
  const answeredCount = attempts.length;

  const numbersToDisplay = mode === 'review' 
    ? questionIds.map((id, index) => ({ id, index }))
    : (() => {
        const answeredIds = new Set(attempts.map(a => a.questionId));
        const currentId = questionIds[currentQuestionNumber - 1];
        if (currentId) {
          answeredIds.add(currentId);
        }
        return questionIds
          .map((id, index) => ({ id, index }))
          .filter(item => answeredIds.has(item.id))
          .sort((a, b) => a.index - b.index);
      })();

  return (
    <div className="w-full h-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 flex flex-col">
      <h3 className="font-bold mb-4 dark:text-white">Questions</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {numbersToDisplay.map(({ id, index }) => (
          <Link
            key={id}
            href={`${basePath}/${index + 1}`}
            className={`flex items-center justify-center h-10 w-10 rounded-lg font-mono text-sm transition-colors ${getStatusClass(id, index)}`}
          >
            {index + 1}
          </Link>
        ))}
      </div>
      <div className="mt-auto text-sm space-y-2 dark:text-gray-300">
        <h4 className="font-semibold">Progress</h4>
        <p>{answeredCount} of {questionIds.length} answered</p>
      </div>
    </div>
  );
}