import React from 'react';
import { useState, useEffect } from 'react';
import { Quiz } from './Quiz';
import { Flashcards } from './Flashcards';
import { StudyStats } from './StudyStats';

// --- Interfaces (No Changes) ---
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

// --- Data Structure for Saved Progress ---
interface UserProgress {
    totalStudyTime: number;
    totalFlashcardsReviewed: number;
    quizHistory: {
        score: number;
        total: number;
        timestamp: number;
    }[];
}

// --- Helper function to select random questions (No Changes) ---
const selectRandomQuestions = (allQuestions: StudyData['quiz'], numQuestions: number) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(numQuestions, allQuestions.length));
};

export const StudyResults: React.FC<StudyResultsProps> = ({ studyData }) => {
    const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards' | 'stats'>('quiz');

    // --- State Management ---
    // The state is now initialized by loading from localStorage
    const [quizScore, setQuizScore] = useState(0);
    const [studyTime, setStudyTime] = useState(0);
    const [flashcardsReviewed, setFlashcardsReviewed] = useState(0);
    const [quizHistory, setQuizHistory] = useState<UserProgress['quizHistory']>([]);

    const [activeQuestions, setActiveQuestions] = useState<StudyData['quiz']>([]);
    const NUM_QUESTIONS_PER_QUIZ = 5;

    // == 1. LOAD PROGRESS WHEN APP STARTS ==
    useEffect(() => {
        try {
            const savedProgressRaw = localStorage.getItem('studyGenieProgress');
            if (savedProgressRaw) {
                const savedProgress: UserProgress = JSON.parse(savedProgressRaw);
                setStudyTime(savedProgress.totalStudyTime || 0);
                setFlashcardsReviewed(savedProgress.totalFlashcardsReviewed || 0);
                setQuizHistory(savedProgress.quizHistory || []);
            }
        } catch (error) {
            console.error("Failed to load progress from localStorage", error);
        }

        if (studyData.quiz.length > 0) {
            setActiveQuestions(selectRandomQuestions(studyData.quiz, NUM_QUESTIONS_PER_QUIZ));
        }
    }, [studyData]); // This effect runs once when the component gets the studyData

    // == 2. SAVE PROGRESS WHENEVER IT CHANGES ==
    useEffect(() => {
        const progress: UserProgress = {
            totalStudyTime: studyTime,
            totalFlashcardsReviewed: flashcardsReviewed,
            quizHistory: quizHistory,
        };
        try {
            localStorage.setItem('studyGenieProgress', JSON.stringify(progress));
        } catch (error) {
            console.error("Failed to save progress to localStorage", error);
        }
        // This effect runs every time one of these state variables changes
    }, [studyTime, flashcardsReviewed, quizHistory]);


    // --- Timer Logic (No Changes) ---
    useEffect(() => {
        const timer = setInterval(() => {
            setStudyTime(prevTime => prevTime + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Event Handlers ---
    const handleQuizComplete = (score: number) => {
        setQuizScore(score);
        // Add the new result to our history
        const newHistoryEntry = {
            score: score,
            total: activeQuestions.length,
            timestamp: Date.now()
        };
        setQuizHistory(prevHistory => [...prevHistory, newHistoryEntry]);
    };

    const handleQuizRetake = () => {
        setQuizScore(0); // Reset current score, but keep the history
        setActiveQuestions(selectRandomQuestions(studyData.quiz, NUM_QUESTIONS_PER_QUIZ));
    };

    const handleFlashcardProgress = (reviewedCount: number) => {
        // We update the total count of reviewed cards
        setFlashcardsReviewed(prevTotal => prevTotal + reviewedCount);
    };

    const handleViewStats = () => {
        setActiveTab('stats');
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* --- Tab Buttons (No Changes) --- */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-2 flex space-x-2 border border-slate-700/50 shadow-lg">
                    <button onClick={() => setActiveTab('quiz')} className={`tab-button ${activeTab === 'quiz' ? 'active' : 'inactive'}`}>🧠 Interactive Quiz</button>
                    <button onClick={() => setActiveTab('flashcards')} className={`tab-button ${activeTab === 'flashcards' ? 'active' : 'inactive'}`}>📚 Flashcards</button>
                    <button onClick={() => setActiveTab('stats')} className={`tab-button ${activeTab === 'stats' ? 'active' : 'inactive'}`}>📊 Progress</button>
                </div>
            </div>

            {/* --- Tab Content --- */}
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
                        correctAnswers={quizScore} // This still shows the score of the *last* quiz taken
                        totalQuestions={activeQuestions.length}
                        studyTime={studyTime} // This is the total time from all sessions
                        flashcardsReviewed={flashcardsReviewed} // Total reviewed from all sessions
                        totalFlashcards={studyData.flashcards.length}
                    />
                )}
            </div>
        </div>
    );
};