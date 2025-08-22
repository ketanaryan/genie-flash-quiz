
import React, { useState, useEffect } from 'react';
import { Quiz } from './Quiz';
import { Flashcards } from './Flashcards';
import { StudyStats } from './StudyStats';

interface StudyData {
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
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
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards' | 'stats'>('quiz');
  const [quizScore, setQuizScore] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [flashcardsReviewed, setFlashcardsReviewed] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
  };

  const handleFlashcardProgress = (reviewed: number) => {
    setFlashcardsReviewed(reviewed);
  };

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
          <button
            onClick={() => setActiveTab('stats')}
            className={`tab-button ${activeTab === 'stats' ? 'active' : 'inactive'}`}
          >
            Progress
          </button>
        </div>
      </div>

      <div className="min-h-96">
        {activeTab === 'quiz' && (
          <Quiz 
            questions={studyData.quiz} 
            onRetakeQuiz={() => setQuizScore(0)}
          />
        )}
        {activeTab === 'flashcards' && (
          <Flashcards 
            flashcards={studyData.flashcards}
            onProgressUpdate={handleFlashcardProgress}
          />
        )}
        {activeTab === 'stats' && (
          <StudyStats
            quizScore={quizScore}
            totalQuestions={studyData.quiz.length}
            studyTime={studyTime}
            flashcardsReviewed={flashcardsReviewed}
            totalFlashcards={studyData.flashcards.length}
          />
        )}
      </div>
    </div>
  );
};
