
import React, { useState } from 'react';
import { Quiz } from './Quiz';
import { Flashcards } from './Flashcards';

interface StudyData {
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  flashcards: {
    term: string;
    definition: string;
  }[];
}

interface StudyResultsProps {
  studyData: StudyData;
}

export const StudyResults: React.FC<StudyResultsProps> = ({ studyData }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards'>('quiz');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-center mb-8">
        <div className="bg-surface rounded-lg p-1 flex space-x-1">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`tab-button ${activeTab === 'quiz' ? 'active' : 'inactive'}`}
          >
            Interactive Quiz
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`tab-button ${activeTab === 'flashcards' ? 'active' : 'inactive'}`}
          >
            Flashcards
          </button>
        </div>
      </div>

      <div className="min-h-96">
        {activeTab === 'quiz' && <Quiz questions={studyData.quiz} />}
        {activeTab === 'flashcards' && <Flashcards flashcards={studyData.flashcards} />}
      </div>
    </div>
  );
};
