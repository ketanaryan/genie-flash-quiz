
import React from 'react';
import { Trophy, Target, BookOpen, Clock } from 'lucide-react';

interface StudyStatsProps {
  quizScore?: number;
  totalQuestions?: number;
  studyTime?: number;
  flashcardsReviewed?: number;
  totalFlashcards?: number;
}

export const StudyStats: React.FC<StudyStatsProps> = ({
  quizScore = 0,
  totalQuestions = 0,
  studyTime = 0,
  flashcardsReviewed = 0,
  totalFlashcards = 0
}) => {
  const quizPercentage = totalQuestions > 0 ? Math.round((quizScore / totalQuestions) * 100) : 0;
  const flashcardProgress = totalFlashcards > 0 ? Math.round((flashcardsReviewed / totalFlashcards) * 100) : 0;
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card-gradient rounded-xl border border-border p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-primary" />
        <span>Study Progress</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-8 w-8 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{quizPercentage}%</div>
          <div className="text-sm text-muted-foreground">Quiz Score</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="h-8 w-8 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{flashcardProgress}%</div>
          <div className="text-sm text-muted-foreground">Cards Reviewed</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-8 w-8 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">{formatTime(studyTime)}</div>
          <div className="text-sm text-muted-foreground">Study Time</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400">{quizScore}/{totalQuestions}</div>
          <div className="text-sm text-muted-foreground">Correct Answers</div>
        </div>
      </div>
    </div>
  );
};
