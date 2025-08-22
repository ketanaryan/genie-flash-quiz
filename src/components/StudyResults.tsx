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

const selectRandomQuestions = (allQuestions: StudyData['quiz'], numQuestions: number) => {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(numQuestions, allQuestions.length));
};

export const StudyResults: React.FC<StudyResultsProps> = ({ studyData }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards' | 'stats'>('quiz');
  const [quizScore, setQuizScore] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [flashcardsReviewed, setFlashcardsReviewed] = useState(0);
  const [startTime] = useState(Date.now());
  
  const [activeQuestions, setActiveQuestions] = useState<StudyData['quiz']>([]);
  const NUM_QUESTIONS_PER_QUIZ = 5;

  useEffect(() => {
    if (studyData.quiz.length > 0) {
      setActiveQuestions(selectRandomQuestions(studyData.quiz, NUM_QUESTIONS_PER_QUIZ));
    }
  }, [studyData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
  };
  
  const handleQuizRetake = () => {
    setQuizScore(0);
    setActiveQuestions(selectRandomQuestions(studyData.quiz, NUM_QUESTIONS_PER_QUIZ));
  };

  const handleFlashcardProgress = (reviewed: number) => {
    setFlashcardsReviewed(reviewed);
  };
  
  const handleViewStats = () => {
    setActiveTab('stats');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-center mb-8">
         <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-2 flex space-x-2 border border-slate-700/50 shadow-lg">
           <button onClick={() => setActiveTab('quiz')} className={`tab-button ${activeTab === 'quiz' ? 'active' : 'inactive'}`}>🧠 Interactive Quiz</button>
           <button onClick={() => setActiveTab('flashcards')} className={`tab-button ${activeTab === 'flashcards' ? 'active' : 'inactive'}`}>📚 Flashcards</button>
           <button onClick={() => setActiveTab('stats')} className={`tab-button ${activeTab === 'stats' ? 'active' : 'inactive'}`}>📊 Progress</button>
         </div>
      </div>
      
      <div className="min-h-96">
        {activeTab === 'quiz' && (
          <Quiz 
            questions={activeQuestions}
            onRetakeQuiz={handleQuizRetake}
            onQuizComplete={handleQuizComplete}
            onViewStats={handleViewStats}
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
            correctAnswers={quizScore}
            totalQuestions={activeQuestions.length}
            studyTime={studyTime}
            flashcardsReviewed={flashcardsReviewed}
            totalFlashcards={studyData.flashcards.length}
          />
        )}
      </div>
    </div>
  );
};