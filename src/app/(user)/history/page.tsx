// src/app/(user)/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Session {
  id: string; // Now a UUID string
  createdAt: string;
  filters: { specialties?: string[] };
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
  nextQuestionNumber: number;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/history`, {

          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Session History</h1>
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
        {loading ? (
          <p className="dark:text-gray-300">Loading history...</p>
        ) : (
          <ul className="space-y-4">
            {sessions.map(session => (
              <li key={session.id} className="p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 flex justify-between items-center">
                <div>
                  <p className="font-semibold dark:text-white">
                    {session.filters.specialties?.join(', ') || 'Mixed Session'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right flex items-center gap-4">
                    <p className="font-bold text-lg dark:text-white">{session.score} / {session.totalQuestions}</p>
                    {/* --- THIS IS THE NEW LOGIC --- */}
                    {session.isCompleted ? (
                        <Link href={`/session/${session.id}/review/1`} className="text-sm font-semibold text-indigo-500 hover:underline">
                            Review
                        </Link>
                    ) : (
                        <Link href={`/session/${session.id}/${session.nextQuestionNumber}`} className="text-sm font-semibold text-green-500 hover:underline">
                            Resume Quiz
                        </Link>
                    )}
                </div>
              </li>
            ))}
            {sessions.length === 0 && <p className="dark:text-gray-400">You have no past sessions.</p>}
          </ul>
        )}
      </div>
    </div>
  );
}