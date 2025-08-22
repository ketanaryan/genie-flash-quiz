
import React from 'react';
import { BookOpen, Sparkles, FileText, Brain } from 'lucide-react';

export const LoadingView: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="animate-pulse-glow p-6 bg-surface rounded-full inline-block">
          <Brain className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">
        AI is analyzing your PDF...
      </h2>
      
      <div className="space-y-4 text-muted-foreground mb-8">
        <div className="flex items-center justify-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Reading and understanding your document</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Google Gemini AI processing content</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>Generating personalized quiz questions</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <span>Creating interactive flashcards</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="w-full bg-surface rounded-full h-2">
          <div className="bg-hero-gradient h-2 rounded-full animate-pulse" style={{ width: '85%' }}></div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Powered by Google Gemini AI</span>
          <span>Almost ready...</span>
        </div>
      </div>
    </div>
  );
};
