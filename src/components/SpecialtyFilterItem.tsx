// src/components/SpecialtyFilterItem.tsx
'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
  specialty: { name: string; topics: string[] };
  isSelected: boolean;
  onSpecialtyChange: (name: string) => void;
}

export default function SpecialtyFilterItem({ specialty, isSelected, onSpecialtyChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="py-2 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="flex items-center gap-2">
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
          <ChevronRight
            className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
          />
        </button>
        <label className="flex-1 flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/50">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSpecialtyChange(specialty.name)}
            className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <span className="font-semibold">{specialty.name}</span>
        </label>
      </div>
      {isExpanded && (
        <div className="pl-12 pt-2 space-y-2">
          {specialty.topics.map(topic => (
            <label key={topic} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                // Add topic selection logic here in the future
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span>{topic}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}