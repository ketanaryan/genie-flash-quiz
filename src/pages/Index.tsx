
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
    console.log('Starting PDF analysis with Gemini AI for file:', file.name);

    try {
      // Extract text from PDF using Gemini
      console.log('Extracting and analyzing PDF content...');
      const extractedText = await PDFService.extractTextFromPDF(file);
      console.log('Text successfully extracted and analyzed');
      
      if (extractedText.length < 100) {
        throw new Error('The PDF appears to contain insufficient readable content. Please try a different PDF with more text.');
      }

      // Generate study materials using the extracted text
      console.log('Generating personalized study materials...');
      const generatedStudyData = await PDFService.generateStudyMaterials(extractedText);
      console.log('Study materials successfully generated:', generatedStudyData);

      setStudyData(generatedStudyData);
      setAppState('success');
    } catch (error) {
      console.error('Error processing PDF with Gemini:', error);
      setAppState('error');
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("We couldn't process your PDF. This might be due to the PDF format or content. Please try a different PDF with clear, readable text.");
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
            Upload your PDF and get AI-generated quizzes and flashcards powered by Google Gemini
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
