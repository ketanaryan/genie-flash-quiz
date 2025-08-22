
import React from 'react';
import { BookOpen, Sparkles, FileText } from 'lucide-react';

export const LoadingView: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="animate-pulse-glow p-6 bg-surface rounded-full inline-block">
          <FileText className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">
        Processing your PDF...
      </h2>
      
      <div className="space-y-4 text-muted-foreground mb-8">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>Extracting text from your document</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <span>Analyzing content and key concepts</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Generating personalized study materials</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="w-full bg-surface rounded-full h-2">
          <div className="bg-hero-gradient h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Analyzing your PDF content...</span>
          <span>Processing...</span>
        </div>
      </div>
    </div>
  );
};
