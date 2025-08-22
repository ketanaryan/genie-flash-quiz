
import React, { useState } from 'react';
import { CheckCircle, XCircle, BookOpen, RotateCcw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizProps {
  questions: Question[];
  onRetakeQuiz?: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onRetakeQuiz }) => {
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

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanations({});
    onRetakeQuiz?.();
  };

  const toggleExplanation = (questionIndex: number) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const getScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScorePercentage = () => {
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
        const isAnswered = selectedAnswers[questionIndex] !== undefined;
        const userAnswer = selectedAnswers[questionIndex];
        const isCorrect = userAnswer === question.correctAnswer;
        const showExplanation = showExplanations[questionIndex];

        return (
          <div key={questionIndex} className="quiz-card animate-scale-in" style={{ animationDelay: `${questionIndex * 0.1}s` }}>
            <h3 className="text-lg font-semibold mb-4">
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
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-center justify-between
                      ${isSelected && !showResults 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:border-primary/50 hover:bg-surface-alt'
                      }
                      ${showCorrectAnswer 
                        ? 'border-green-500 bg-green-500/10 text-green-400' 
                        : ''
                      }
                      ${showWrongAnswer 
                        ? 'border-red-500 bg-red-500/10 text-red-400' 
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

            {showResults && !isCorrect && isAnswered && (
              <div className="mt-4">
                <button
                  onClick={() => toggleExplanation(questionIndex)}
                  className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
                </button>
                
                {showExplanation && (
                  <div className="mt-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg animate-scale-in">
                    <h4 className="font-semibold text-yellow-400 mb-2">Why this answer is wrong:</h4>
                    <p className="text-muted-foreground mb-3">
                      You selected "{userAnswer}", but the correct answer is "{question.correctAnswer}".
                    </p>
                    {question.explanation && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Explanation:</h4>
                        <p className="text-muted-foreground">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {!showResults && (
        <div className="text-center">
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
        <div className="text-center p-6 bg-card-gradient rounded-xl border border-border animate-scale-in">
          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-lg mb-2">
            You scored <span className="text-primary font-bold">{getScore()}</span> out of{' '}
            <span className="font-bold">{questions.length}</span> ({getScorePercentage()}%)
          </p>
          <p className="text-muted-foreground mb-4">{getPerformanceMessage()}</p>
          
          <div className="w-full bg-surface rounded-full h-3 mb-6">
            <div 
              className="bg-hero-gradient h-3 rounded-full transition-all duration-1000"
              style={{ width: `${getScorePercentage()}%` }}
            ></div>
          </div>

          <button
            onClick={handleRetake}
            className="hero-button flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
