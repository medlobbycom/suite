// src/app/(user)/session/[sessionId]/[questionNumber]/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import QuestionNavigator from '@/components/QuestionNavigator';

interface Question { id: number; text: string; options: string[]; }
interface AnswerResult { isCorrect: boolean; correctAnswerIndex: number; explanation: string; }
interface Attempt { questionId: number, isCorrect: boolean }

export default function SessionPage({ params }: { params: { sessionId: string; questionNumber: string } }) {
  const router = useRouter();
  const { sessionId, questionNumber } = params;
  const questionIndex = parseInt(questionNumber, 10) - 1;

  const [questions, setQuestions] = useState<Question[]>([]);
  // This state will now be populated from the database on page load
  const [attempts, setAttempts] = useState<Attempt[]>([]); 
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);

  useEffect(() => {
    // THIS IS THE FIX: This function now fetches EVERYTHING for the session,
    // including past attempts, from the database.
    const initializeSession = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to load session');
        const data = await response.json();
        
        setQuestions(data.questions.filter(Boolean));
        setAttempts(data.attempts); // <-- Load previous attempts from the database
        setQuestionIds(data.session.questionIds);

      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    initializeSession();
  }, [sessionId, router]);

  const handleCheckAnswer = async () => {
    if (selectedOptionIndex === null) return;
    const token = localStorage.getItem('token');
    const currentQuestion = questions[questionIndex];
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/question/${currentQuestion.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ selectedOptionIndex }),
      });
      if (!response.ok) throw new Error('Failed to submit answer');
      const resultData = await response.json();
      setLastResult(resultData);
      setIsAnswerChecked(true);
      
      const newAttempt = { questionId: currentQuestion.id, isCorrect: resultData.isCorrect };
      // Update the local attempts state for instant UI feedback
      setAttempts(prev => [...prev.filter(a => a.questionId !== newAttempt.questionId), newAttempt]);

    } catch (error) { console.error(error); alert('Error checking answer.'); }
  };
  
  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      const nextQuestionNumber = questionIndex + 2;
      router.push(`/session/${sessionId}/${nextQuestionNumber}`);
      setSelectedOptionIndex(null);
      setIsAnswerChecked(false);
      setLastResult(null);
    } else {
      router.push('/clinical/qbank');
    }
  };
  
  if (loading) return <div className="text-center p-8">Loading Quiz...</div>;

  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) return <div className="text-center p-8">Question not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <QuestionNavigator 
          sessionId={sessionId}
          questionIds={questionIds}
          currentQuestionNumber={parseInt(questionNumber, 10)}
          attempts={attempts} // Pass the attempts from the database
          mode="live"
          basePath={`/session/${sessionId}`}
        />
      </div>

      <div className="lg:col-span-3">
        {/* The JSX for the quiz UI does not need to change */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20">
          <p className="text-lg md:text-xl font-medium mb-6 dark:text-gray-200">{currentQuestion.text}</p>
          <div className="space-y-4">
            {currentQuestion.options.map((option: string, index: number) => {
                let buttonClass = 'bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50';
                if (isAnswerChecked && lastResult) {
                  if (index === lastResult.correctAnswerIndex) {
                    buttonClass = 'bg-green-500 text-white';
                  } else if (index === selectedOptionIndex && !lastResult.isCorrect) {
                    buttonClass = 'bg-red-500 text-white';
                  }
                } else if (index === selectedOptionIndex) {
                  buttonClass = 'bg-indigo-200 dark:bg-indigo-900 border-indigo-500 ring-2 ring-indigo-500';
                }
                return (
                    <button
                      key={index}
                      onClick={() => !isAnswerChecked && setSelectedOptionIndex(index)}
                      disabled={isAnswerChecked}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${buttonClass}`}
                    >
                      <span className="font-mono mr-4">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </button>
                );
            })}
          </div>
        </div>
        
        {isAnswerChecked && lastResult?.explanation && (
          <div className="mt-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20">
            <h3 className="font-bold text-lg dark:text-white mb-2">Explanation</h3>
            <p className="dark:text-gray-300">{lastResult.explanation}</p>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          {isAnswerChecked ? (
            <button onClick={handleNextQuestion} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700">
              {questionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          ) : (
            <button onClick={handleCheckAnswer} disabled={selectedOptionIndex === null} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Check Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}