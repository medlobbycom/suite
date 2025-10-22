// src/app/(user)/clinical/qbank/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SpecialtyFilterItem from '@/components/SpecialtyFilterItem';

interface UserProgress { 
  totalQuestions: number; 
  correctCount: number; 
  incorrectCount: number; 
  attemptedCount: number; 
}
interface Specialty { name: string; topics: string[]; }
interface FilterData { specialties: Specialty[]; }

export default function QbankPage() {
    const router = useRouter();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [filters, setFilters] = useState<FilterData | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        const getInitialData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }
            try {
                const [progressRes, filtersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/progress`, { headers: { Authorization: `Bearer ${token}` } }),
fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/data`, { headers: { Authorization: `Bearer ${token}` } }),

                ]);
                if (!progressRes.ok || !filtersRes.ok) throw new Error('Failed to fetch dashboard data');
                setProgress(await progressRes.json());
                setFilters(await filtersRes.json());
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        };
        getInitialData();
    }, [router]);

    const handleSpecialtyChange = (specialtyName: string) => {
        setSelectedSpecialties(prev => 
            prev.includes(specialtyName)
                ? prev.filter(s => s !== specialtyName)
                : [...prev, specialtyName]
        );
    };

    const handleStartSession = async () => { 
        const token = localStorage.getItem('token');
        
        // --- THIS IS THE FIX ---
        // 1. Define a specific type for our payload to remove the 'any' error
        interface SessionPayload {
          specialties: string[];
          status: string;
          limit?: number; // Make limit optional
        }
        
        // 2. Create the base payload with the correct type
        const payload: SessionPayload = {
            specialties: selectedSpecialties,
            status: 'ALL'
        };

        // 3. Only add the limit if it's not set to "All" (value is 0)
        if (limit > 0) {
            payload.limit = limit;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to create session');
            const session = await response.json();
            router.push(`/session/${session.id}/1`);
        } catch (error) { console.error(error); alert('Failed to start session.'); }
    };
    
    if (loading) { return <div>Loading Question Bank...</div>; }

    const correctPercentage = progress && progress.attemptedCount > 0 ? (progress.correctCount / progress.attemptedCount) * 100 : 0;

    return (
        <div className="w-full max-w-7xl mx-auto"> 
            <div className="space-y-8 dark:text-gray-200">
                <h1 className="text-4xl font-bold">Question Bank</h1>
                
                <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
                    <div className="relative h-4 w-full bg-gray-300/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full" style={{ width: `${correctPercentage}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span>{correctPercentage.toFixed(0)}% correct</span>
                        <span>{progress?.attemptedCount} of {progress?.totalQuestions} attempted</span>
                    </div>
                </div>

                <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20 space-y-6">
                    <h2 className="text-2xl font-semibold">New Session</h2>
                    
                    <div>
                        <label htmlFor="limit" className="block text-sm font-medium mb-2">Number of Questions</label>
                        <select
                            id="limit"
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={0}>All</option>
                        </select>
                    </div>

                    <div>
                        {filters?.specialties.map(specialty => (
                            <SpecialtyFilterItem
                                key={specialty.name}
                                specialty={specialty}
                                isSelected={selectedSpecialties.includes(specialty.name)}
                                onSpecialtyChange={handleSpecialtyChange}
                            />
                        ))}
                    </div>
                    
                    <div className="pt-6">
                        <button onClick={handleStartSession} className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700">
                            Start Questions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}