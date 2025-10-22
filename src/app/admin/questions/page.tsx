// src/app/admin/questions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  topic: string;
  specialty: string;
  difficulty: string;
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions`, {

          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch questions.');

        const data: Question[] = await response.json();
        setQuestions(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleDelete = async (questionId: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
    } catch (err: unknown) { // <-- THIS IS THE FIX
      if (err instanceof Error) {
        setError(err.message);
        alert(`Error: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
        alert('An unknown error occurred.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Question Management
        </h1>
        <Link href="/admin/questions/new" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          + Add New Question
        </Link>
      </div>

      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
        {loading && <p className="text-center dark:text-gray-300">Loading questions...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left dark:text-gray-300">
              <thead className="border-b border-gray-300/50 dark:border-gray-700/50">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Question Text</th>
                  <th className="p-4">Topic</th>
                  <th className="p-4">Specialty</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id} className="border-b border-gray-200/50 dark:border-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/20">
                    <td className="p-4">{question.id}</td>
                    <td className="p-4 max-w-sm truncate">{question.text}</td>
                    <td className="p-4">{question.topic}</td>
                    <td className="p-4">{question.specialty}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        question.difficulty === 'EASY' ? 'bg-green-200 text-green-800' :
                        question.difficulty === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="p-4 flex gap-4 items-center">
                      <Link 
                        href={`/admin/questions/edit/${question.id}`} 
                        className="font-medium text-blue-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(question.id)}
                        className="font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}