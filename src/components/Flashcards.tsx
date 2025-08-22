
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface Flashcard {
  term: string;
  definition: string;
}

interface FlashcardsProps {
  flashcards: Flashcard[];
}

export const Flashcards: React.FC<FlashcardsProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </p>
      </div>

      <div className="mb-8">
        <div 
          className={`flip-card mx-auto w-full h-80 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front flashcard flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">{currentCard.term}</h2>
                <p className="text-muted-foreground text-sm">Click to reveal definition</p>
              </div>
            </div>
            <div className="flip-card-back flashcard flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-lg leading-relaxed">{currentCard.definition}</p>
                <p className="text-muted-foreground text-sm mt-4">Click to go back to term</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={handlePrevious}
          disabled={flashcards.length <= 1}
          className="nav-button disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleFlip}
          className="nav-button"
          title="Flip card"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          disabled={flashcards.length <= 1}
          className="nav-button disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {flashcards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsFlipped(false);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary scale-125' 
                : 'bg-surface-alt hover:bg-surface'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
