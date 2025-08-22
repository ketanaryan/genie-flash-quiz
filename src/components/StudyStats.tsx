import React from 'react';
import { Trophy, Target, BookOpen, Clock } from 'lucide-react';

interface StudyStatsProps {
  correctAnswers?: number; // Renamed from quizScore for clarity
  totalQuestions?: number;
  studyTime?: number;
  flashcardsReviewed?: number;
  totalFlashcards?: number;
}

export const StudyStats: React.FC<StudyStatsProps> = ({
  correctAnswers = 0, // Updated prop name
  totalQuestions = 0,
  studyTime = 0,
  flashcardsReviewed = 0,
  totalFlashcards = 0
}) => {
  // Calculation is for accuracy, so we'll rename the variable for clarity
  const quizAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const flashcardProgress = totalFlashcards > 0 ? Math.round((flashcardsReviewed / totalFlashcards) * 100) : 0;
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="stats-card">
        <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg glow-purple">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Study Progress Dashboard
          </span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl border border-green-500/30 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full glow-green">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">{quizAccuracy}%</div>
            <div className="text-sm text-slate-300">Quiz Accuracy</div> {/* <-- IMPROVEMENT: Changed Label */}
            <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
              <div 
                className="progress-bar h-2" 
                style={{ width: `${quizAccuracy}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full glow-blue">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">{flashcardProgress}%</div>
            <div className="text-sm text-slate-300">Cards Reviewed</div>
            <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full h-2 transition-all duration-500" 
                style={{ width: `${flashcardProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full glow-purple">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">{formatTime(studyTime)}</div>
            <div className="text-sm text-slate-300">Study Time</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl border border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full shadow-lg shadow-yellow-500/30">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{correctAnswers}/{totalQuestions}</div> {/* Updated variable */}
            <div className="text-sm text-slate-300">Correct Answers</div>
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="stats-card">
        <h4 className="text-lg font-semibold mb-4 text-slate-200">🏆 Achievements</h4>
        <div className="flex flex-wrap gap-3">
          {quizAccuracy >= 80 && ( // Updated variable
            <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-full text-sm text-green-400">
              🌟 Quiz Master
            </div>
          )}
          {flashcardProgress >= 50 && (
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-full text-sm text-blue-400">
              📚 Study Enthusiast
            </div>
          )}
          {studyTime >= 300 && (
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-full text-sm text-purple-400">
              ⏰ Dedicated Learner
            </div>
          )}
        </div>
      </div>
    </div>
  );
};