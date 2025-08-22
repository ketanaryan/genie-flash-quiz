
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { LoadingView } from '@/components/LoadingView';
import { StudyResults } from '@/components/StudyResults';
import { ErrorView } from '@/components/ErrorView';
import { PDFService } from '@/services/pdfService';

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
    console.log('File selected:', selectedFile.name, selectedFile.type);
  };

  const handleGenerateStudySet = async () => {
    if (!file) return;

    setAppState('loading');
    console.log('Starting PDF analysis for file:', file.name);

    try {
      // Extract text from PDF
      console.log('Extracting text from PDF...');
      const extractedText = await PDFService.extractTextFromPDF(file);
      console.log('Text extracted, length:', extractedText.length);
      
      if (extractedText.length < 50) {
        throw new Error('Could not extract enough readable text from the PDF. Please ensure the PDF contains text content.');
      }

      // Generate study materials from extracted text
      console.log('Generating study materials from extracted text...');
      const generatedStudyData = await PDFService.generateStudyMaterials(extractedText);
      console.log('Study materials generated:', generatedStudyData);

      setStudyData(generatedStudyData);
      setAppState('success');
    } catch (error) {
      console.error('Error processing PDF:', error);
      setAppState('error');
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Sorry, we couldn't process your PDF file. Please ensure it contains readable text and try again.");
      }
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
            Upload your PDF and get AI-generated quizzes and flashcards based on the actual content
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
