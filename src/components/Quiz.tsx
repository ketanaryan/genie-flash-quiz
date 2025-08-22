import React, { useState } from 'react';
import { CheckCircle, XCircle, BookOpen, RotateCcw, BarChart2 } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizProps {
  questions: Question[];
  onRetakeQuiz: () => void;
  onQuizComplete: (score: number) => void;
  onViewStats: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onRetakeQuiz, onQuizComplete, onViewStats }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState<{ [key: number]: boolean }>({});

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const getScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleSubmit = () => {
    setShowResults(true);
    onQuizComplete(getScore());
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanations({});
    onRetakeQuiz();
  };

  const toggleExplanation = (questionIndex: number) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const getScorePercentage = () => {
    if (questions.length === 0) return 0;
    return Math.round((getScore() / questions.length) * 100);
  };

  const getPerformanceMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return "Excellent! You've mastered this material! 🎉";
    if (percentage >= 80) return "Great work! You have a solid understanding! 👏";
    if (percentage >= 70) return "Good job! A few more reviews and you'll excel! 📚";
    if (percentage >= 60) return "Not bad! Focus on the areas you missed! 💪";
    return "Keep studying! Review the explanations and try again! 📖";
  };

  return (
    <div className="space-y-6">
      {questions.map((question, questionIndex) => {
        const userAnswer = selectedAnswers[questionIndex];
        const isCorrect = userAnswer === question.correctAnswer;
        const showExplanation = showExplanations[questionIndex];

        return (
          <div key={questionIndex} className="quiz-card animate-scale-in" style={{ animationDelay: `${questionIndex * 0.1}s` }}>
            <h3 className="text-lg font-semibold mb-4 text-slate-200">
              {questionIndex + 1}. {question.question}
            </h3>
            
            <div className="space-y-3 mb-4">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[questionIndex] === option;
                const isCorrectOption = option === question.correctAnswer;
                const showCorrectAnswer = showResults && isCorrectOption;
                const showWrongAnswer = showResults && isSelected && !isCorrectOption;
                
                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(questionIndex, option)}
                    disabled={showResults}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between text-slate-300
                      ${!showResults ? 'hover:border-purple-500 hover:bg-purple-500/10' : ''}
                      ${isSelected && !showResults 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-slate-700'
                      }
                      ${showCorrectAnswer 
                        ? '!border-green-500 !bg-green-500/10 !text-green-400' 
                        : ''
                      }
                      ${showWrongAnswer 
                        ? '!border-red-500 !bg-red-500/10 !text-red-400' 
                        : ''
                      }
                    `}
                  >
                    <span>{option}</span>
                    {showCorrectAnswer && <CheckCircle className="h-5 w-5" />}
                    {showWrongAnswer && <XCircle className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>

            {showResults && !isCorrect && userAnswer && (
              <div className="mt-4">
                <button
                  onClick={() => toggleExplanation(questionIndex)}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
                </button>
                
                {showExplanation && (
                  <div className="mt-3 p-4 bg-slate-800 border border-slate-700 rounded-lg animate-scale-in">
                    <p className="text-slate-400 mb-2">
                      You selected "{userAnswer}", but the correct answer is "{question.correctAnswer}".
                    </p>
                    {question.explanation && (
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-1">Explanation:</h4>
                        <p className="text-slate-400">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {!showResults && questions.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== questions.length}
            className="hero-button"
          >
            Submit Quiz
          </button>
        </div>
      )}
      
      {showResults && (
        <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700 animate-scale-in">
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
          <p className="text-lg text-slate-300 mb-2">
            You scored <span className="text-purple-400 font-bold">{getScore()}</span> out of{' '}
            <span className="font-bold text-white">{questions.length}</span> ({getScorePercentage()}%)
          </p>
          <p className="text-slate-400 mb-4">{getPerformanceMessage()}</p>
          
          <div className="w-full bg-slate-700 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${getScorePercentage()}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={handleRetake}
              className="secondary-button"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retake Quiz
            </button>
            <button
              onClick={onViewStats}
              className="hero-button"
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              View Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
};