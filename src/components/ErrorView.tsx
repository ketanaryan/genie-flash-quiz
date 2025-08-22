
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-md mx-auto text-center animate-fade-in">
      <div className="mb-6">
        <div className="p-4 bg-destructive/10 rounded-full inline-block mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>

      <button
        onClick={onRetry}
        className="hero-button flex items-center space-x-2 mx-auto"
      >
        <RefreshCw className="h-5 w-5" />
        <span>Try Again</span>
      </button>
    </div>
  );
};
