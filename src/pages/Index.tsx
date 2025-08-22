
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { LoadingView } from '@/components/LoadingView';
import { StudyResults } from '@/components/StudyResults';
import { ErrorView } from '@/components/ErrorView';

type AppState = 'idle' | 'loading' | 'success' | 'error';

interface StudyData {
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  flashcards: {
    term: string;
    definition: string;
  }[];
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [studyData, setStudyData] = useState<StudyData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleGenerateStudySet = async () => {
    if (!file) return;

    setAppState('loading');

    try {
      // Simulate API call with FormData
      const formData = new FormData();
      formData.append('file', file);

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock successful response
      const mockData: StudyData = {
        quiz: [
          {
            question: "What is the primary function of React components?",
            options: [
              "Data storage",
              "Building user interfaces",
              "Server management",
              "Database queries"
            ],
            correctAnswer: "Building user interfaces"
          },
          {
            question: "What does JSX stand for?",
            options: [
              "JavaScript XML",
              "Java Syntax Extension",
              "JavaScript Extension",
              "JSON XML"
            ],
            correctAnswer: "JavaScript XML"
          },
          {
            question: "Which hook is used for state management in functional components?",
            options: [
              "useEffect",
              "useContext",
              "useState",
              "useReducer"
            ],
            correctAnswer: "useState"
          },
          {
            question: "What is the Virtual DOM?",
            options: [
              "A database system",
              "A lightweight copy of the real DOM",
              "A server framework",
              "A styling library"
            ],
            correctAnswer: "A lightweight copy of the real DOM"
          }
        ],
        flashcards: [
          {
            term: "Component",
            definition: "A reusable piece of UI that can accept props and return JSX elements."
          },
          {
            term: "Props",
            definition: "Short for properties, these are read-only data passed from parent to child components."
          },
          {
            term: "State",
            definition: "Local data storage that belongs to a component and can trigger re-renders when changed."
          },
          {
            term: "Hook",
            definition: "Special functions that let you use state and other React features in functional components."
          },
          {
            term: "JSX",
            definition: "A syntax extension for JavaScript that allows you to write HTML-like code in React components."
          },
          {
            term: "Virtual DOM",
            definition: "A programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM."
          }
        ]
      };

      setStudyData(mockData);
      setAppState('success');
    } catch (error) {
      setAppState('error');
      setErrorMessage("Sorry, we couldn't process your file. Please try another.");
    }
  };

  const handleRetry = () => {
    setAppState('idle');
    setFile(null);
    setStudyData(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-hero-gradient bg-clip-text text-transparent mb-4">
            StudyGenie
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate interactive study sets from your notes instantly
          </p>
        </div>

        {/* Main Content */}
        {appState === 'idle' && (
          <FileUpload 
            file={file}
            onFileSelect={handleFileSelect}
            onGenerate={handleGenerateStudySet}
          />
        )}

        {appState === 'loading' && <LoadingView />}

        {appState === 'success' && studyData && (
          <StudyResults studyData={studyData} />
        )}

        {appState === 'error' && (
          <ErrorView 
            message={errorMessage}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
