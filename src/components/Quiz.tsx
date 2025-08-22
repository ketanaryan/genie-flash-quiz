
import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: Question[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

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

  const getScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="quiz-card animate-scale-in" style={{ animationDelay: `${questionIndex * 0.1}s` }}>
          <h3 className="text-lg font-semibold mb-4">
            {questionIndex + 1}. {question.question}
          </h3>
          
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedAnswers[questionIndex] === option;
              const isCorrect = option === question.correctAnswer;
              const showCorrectAnswer = showResults && isCorrect;
              const showWrongAnswer = showResults && isSelected && !isCorrect;
              
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
        </div>
      ))}
      
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
          <p className="text-lg">
            You scored <span className="text-primary font-bold">{getScore()}</span> out of{' '}
            <span className="font-bold">{questions.length}</span>
          </p>
          <div className="w-full bg-surface rounded-full h-3 mt-4">
            <div 
              className="bg-hero-gradient h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(getScore() / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
