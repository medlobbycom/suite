'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuestionNavigator from '@/components/QuestionNavigator';

interface Question { id: number; text: string; options: string[]; correctAnswerIndex: number; explanation: string; }
interface Attempt { questionId: number; isCorrect: boolean; selectedOptionIndex: number; }
interface ReviewData {
  questions: Question[];
  attempts: Attempt[];
  session: { questionIds: number[] };
}

export default function ReviewPage({ params }: { params: { sessionId: string; questionNumber: string } }) {
  const router = useRouter();
  const { sessionId, questionNumber } = params;
  const questionIndex = parseInt(questionNumber, 10) - 1;

  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/review`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to load review data');
        const data = await response.json();
        setReviewData(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchReviewData();
  }, [sessionId, router]);

  if (loading || !reviewData) return <div className="flex h-screen items-center justify-center">Loading Review...</div>;

  const currentQuestion = reviewData.questions[questionIndex];
  const currentAttempt = reviewData.attempts.find(a => a.questionId === currentQuestion?.id);

  if (!currentQuestion) return <div className="text-center p-8">Question not found.</div>;

  const isLastQuestion = questionIndex === reviewData.questions.length - 1;
  const isFirstQuestion = questionIndex === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <QuestionNavigator 
          sessionId={sessionId}
          questionIds={reviewData.session.questionIds}
          currentQuestionNumber={parseInt(questionNumber, 10)}
          attempts={reviewData.attempts}
          basePath={`/session/${sessionId}/review`}
          mode="review"
        />
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">Reviewing Question {questionIndex + 1}</p>
          <p className="text-lg md:text-xl font-medium my-4 dark:text-gray-200">{currentQuestion.text}</p>
          <div className="space-y-4">
            {currentQuestion.options.map((option: string, index: number) => {
                let buttonClass = 'bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600';
                if (index === currentQuestion.correctAnswerIndex) {
                  buttonClass = 'bg-green-200 dark:bg-green-900 border-green-500 ring-2 ring-green-500';
                } else if (currentAttempt && index === currentAttempt.selectedOptionIndex) {
                  buttonClass = 'bg-red-200 dark:bg-red-900 border-red-500';
                }
                return (
                    <div key={index} className={`w-full text-left p-4 rounded-lg border ${buttonClass}`}>
                      <span className="font-mono mr-4">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </div>
                );
            })}
          </div>
        </div>
        
        {currentQuestion.explanation && (
          <div className="mt-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20">
            <h3 className="font-bold text-lg dark:text-white mb-2">Explanation</h3>
            <p className="dark:text-gray-300">{currentQuestion.explanation}</p>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
            <Link 
                href={`/session/${sessionId}/review/${questionIndex}`}
                className={`font-bold py-3 px-8 rounded-lg ${isFirstQuestion ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
            >
                Previous
            </Link>
            {isLastQuestion ? (
                <Link href="/history" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700">
                    Finish Review
                </Link>
            ) : (
                <Link href={`/session/${sessionId}/review/${questionIndex + 2}`} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700">
                    Next
                </Link>
            )}
        </div>
      </div>
    </div>
  );
}