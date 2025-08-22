
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ThumbsUp, ThumbsDown, Shuffle } from 'lucide-react';

interface Flashcard {
  term: string;
  definition: string;
}

interface FlashcardsProps {
  flashcards: Flashcard[];
  onProgressUpdate?: (reviewed: number) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ flashcards, onProgressUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set());
  const [cardDifficulty, setCardDifficulty] = useState<{ [key: number]: 'easy' | 'hard' }>({});
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    setShuffledIndices(Array.from({ length: flashcards.length }, (_, i) => i));
  }, [flashcards]);

  useEffect(() => {
    onProgressUpdate?.(reviewedCards.size);
  }, [reviewedCards, onProgressUpdate]);

  const getCurrentCardIndex = () => {
    return isShuffled ? shuffledIndices[currentIndex] : currentIndex;
  };

  const getCurrentCard = () => {
    const cardIndex = getCurrentCardIndex();
    return flashcards[cardIndex];
  };

  const handleNext = () => {
    const cardIndex = getCurrentCardIndex();
    setReviewedCards(prev => new Set([...prev, cardIndex]));
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficultyRating = (difficulty: 'easy' | 'hard') => {
    const cardIndex = getCurrentCardIndex();
    setCardDifficulty(prev => ({
      ...prev,
      [cardIndex]: difficulty
    }));
    setReviewedCards(prev => new Set([...prev, cardIndex]));
  };

  const handleShuffle = () => {
    const shuffled = [...shuffledIndices].sort(() => Math.random() - 0.5);
    setShuffledIndices(shuffled);
    setIsShuffled(true);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCards(new Set());
    setCardDifficulty({});
    setIsShuffled(false);
    setShuffledIndices(Array.from({ length: flashcards.length }, (_, i) => i));
  };

  const getProgressPercentage = () => {
    return flashcards.length > 0 ? (reviewedCards.size / flashcards.length) * 100 : 0;
  };

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>
    );
  }

  const currentCard = getCurrentCard();
  const cardIndex = getCurrentCardIndex();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">
            {reviewedCards.size} of {flashcards.length} reviewed
          </span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <div 
            className="bg-hero-gradient h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={handleShuffle}
          className="flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-surface-alt rounded-lg transition-colors"
        >
          <Shuffle className="h-4 w-4" />
          <span>Shuffle</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-surface-alt rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Flashcard */}
      <div className="relative mb-6">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">{currentCard.term}</h3>
                <p className="text-muted-foreground">Click to reveal definition</p>
              </div>
            </div>
            <div className="flashcard-back">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-primary">{currentCard.term}</h3>
                <p className="text-lg leading-relaxed">{currentCard.definition}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Rating (only show when flipped) */}
      {isFlipped && (
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleDifficultyRating('easy')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              cardDifficulty[cardIndex] === 'easy' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-surface hover:bg-surface-alt'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Easy</span>
          </button>
          <button
            onClick={() => handleDifficultyRating('hard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              cardDifficulty[cardIndex] === 'hard' 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-surface hover:bg-surface-alt'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Hard</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 px-6 py-3 bg-surface hover:bg-surface-alt rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
          {reviewedCards.has(cardIndex) && (
            <div className="text-xs text-primary mt-1">✓ Reviewed</div>
          )}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-3 bg-surface hover:bg-surface-alt rounded-lg transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
