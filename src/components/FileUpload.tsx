
import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onGenerate: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileSelect, onGenerate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto animate-scale-in">
      <div 
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Drag & drop your PDF here or click to select a file
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF files up to 10MB
            </p>
          </div>
        </div>
      </div>

      {file && (
        <div className="mt-6 p-4 bg-surface rounded-lg border border-border animate-fade-in">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-medium">{file.name}</span>
            <span className="text-sm text-muted-foreground">
              ({(file.size / 1024 / 1024).toFixed(1)} MB)
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={onGenerate}
          disabled={!file}
          className="hero-button"
        >
          Generate Study Set
        </button>
      </div>
    </div>
  );
};
