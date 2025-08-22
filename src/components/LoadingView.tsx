
import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export const LoadingView: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="animate-pulse-glow p-6 bg-surface rounded-full inline-block">
          <BookOpen className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">
        Analyzing your document...
      </h2>
      
      <p className="text-muted-foreground mb-8">
        Our AI is reading through your PDF and creating personalized study materials. This usually takes 30-60 seconds.
      </p>
      
      <div className="space-y-3">
        <div className="w-full bg-surface rounded-full h-2">
          <div className="bg-hero-gradient h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Processing content...</span>
          <span>70%</span>
        </div>
      </div>
    </div>
  );
};
