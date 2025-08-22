
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Flashcard {
  term: string;
  definition: string;
}

interface StudyData {
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
}

export class PDFService {
  static async extractTextFromPDF(file: File): Promise<string> {
    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // For now, we'll use a client-side PDF parsing approach
      // In a real implementation, you'd want to send this to a backend service
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Simple text extraction - in reality you'd use a proper PDF parser
      const text = await this.parsePDF(uint8Array);
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private static async parsePDF(data: Uint8Array): Promise<string> {
    // This is a simplified approach. In a real app, you'd use pdf-parse or similar
    // For now, we'll simulate text extraction with some basic logic
    try {
      const decoder = new TextDecoder('utf-8');
      let text = decoder.decode(data);
      
      // Basic cleanup to extract readable text from PDF binary
      text = text.replace(/[^\x20-\x7E\n\r]/g, ' '); // Remove non-printable characters
      text = text.replace(/\s+/g, ' '); // Normalize whitespace
      text = text.trim();
      
      // If we can't extract meaningful text, throw an error
      if (text.length < 50) {
        throw new Error('Could not extract readable text from PDF');
      }
      
      return text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Unable to parse PDF content');
    }
  }

  static async generateStudyMaterials(text: string): Promise<StudyData> {
    try {
      console.log('Analyzing extracted text:', text.substring(0, 200) + '...');
      
      // Split text into sentences for processing
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      if (sentences.length < 5) {
        throw new Error('Not enough content to generate study materials');
      }
      
      // Generate quiz questions based on content
      const quiz = this.generateQuizQuestions(sentences, text);
      
      // Generate flashcards based on content
      const flashcards = this.generateFlashcards(sentences, text);
      
      return { quiz, flashcards };
    } catch (error) {
      console.error('Error generating study materials:', error);
      throw error;
    }
  }

  private static generateQuizQuestions(sentences: string[], fullText: string): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const keyTerms = this.extractKeyTerms(fullText);
    
    // Generate questions based on key terms and content
    keyTerms.slice(0, 4).forEach((term, index) => {
      const context = this.findContextForTerm(term, sentences);
      if (context) {
        const question = this.createQuestionFromContext(term, context, keyTerms);
        if (question) {
          questions.push(question);
        }
      }
    });
    
    // If we don't have enough questions, add some generic ones
    while (questions.length < 3) {
      questions.push(this.generateGenericQuestion(fullText, questions.length));
    }
    
    return questions;
  }

  private static generateFlashcards(sentences: string[], fullText: string): Flashcard[] {
    const flashcards: Flashcard[] = [];
    const keyTerms = this.extractKeyTerms(fullText);
    
    keyTerms.slice(0, 6).forEach(term => {
      const definition = this.findDefinitionForTerm(term, sentences);
      if (definition) {
        flashcards.push({
          term: term,
          definition: definition
        });
      }
    });
    
    return flashcards;
  }

  private static extractKeyTerms(text: string): string[] {
    // Extract potential key terms (capitalized words, repeated terms, etc.)
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = new Map<string, number>();
    
    words.forEach(word => {
      // Clean word and filter meaningful terms
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !this.isCommonWord(cleanWord)) {
        wordCount.set(cleanWord, (wordCount.get(cleanWord) || 0) + 1);
      }
    });
    
    // Sort by frequency and return top terms
    return Array.from(wordCount.entries())
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term, _]) => term);
  }

  private static isCommonWord(word: string): boolean {
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
    return commonWords.includes(word.toLowerCase());
  }

  private static findContextForTerm(term: string, sentences: string[]): string | null {
    const regex = new RegExp(term, 'i');
    return sentences.find(sentence => regex.test(sentence)) || null;
  }

  private static findDefinitionForTerm(term: string, sentences: string[]): string | null {
    const regex = new RegExp(term, 'i');
    const contextSentence = sentences.find(sentence => regex.test(sentence));
    
    if (contextSentence) {
      // Try to extract a definition-like phrase
      let definition = contextSentence.trim();
      if (definition.length > 100) {
        definition = definition.substring(0, 100) + '...';
      }
      return definition;
    }
    
    return null;
  }

  private static createQuestionFromContext(term: string, context: string, allTerms: string[]): QuizQuestion | null {
    // Create a question about the term
    const question = `What is the significance of "${term}" based on the document?`;
    
    // Generate plausible wrong answers
    const wrongAnswers = this.generateWrongAnswers(term, allTerms);
    const correctAnswer = context.length > 80 ? context.substring(0, 80) + '...' : context;
    
    const options = [correctAnswer, ...wrongAnswers].slice(0, 4);
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return {
      question,
      options,
      correctAnswer
    };
  }

  private static generateWrongAnswers(correctTerm: string, allTerms: string[]): string[] {
    const wrongAnswers = [
      `This term is not mentioned in the document`,
      `A concept unrelated to the main topic`,
      `An outdated theory that has been disproven`
    ];
    
    // Add some answers based on other terms if available
    const otherTerms = allTerms.filter(t => t !== correctTerm).slice(0, 2);
    otherTerms.forEach(term => {
      wrongAnswers.push(`Related to ${term} but serves a different purpose`);
    });
    
    return wrongAnswers.slice(0, 3);
  }

  private static generateGenericQuestion(text: string, index: number): QuizQuestion {
    const genericQuestions = [
      {
        question: "Based on the document, what is the main topic discussed?",
        options: [
          "The primary subject matter covered in the text",
          "Unrelated technical specifications",
          "Historical background information only",
          "Statistical data without context"
        ],
        correctAnswer: "The primary subject matter covered in the text"
      },
      {
        question: "What type of information does this document primarily contain?",
        options: [
          "Educational or informational content",
          "Entertainment purposes only",
          "Advertising material",
          "Legal disclaimers"
        ],
        correctAnswer: "Educational or informational content"
      },
      {
        question: "How would you categorize the content of this document?",
        options: [
          "Academic or professional material",
          "Personal diary entries",
          "Shopping lists",
          "Poetry collections"
        ],
        correctAnswer: "Academic or professional material"
      }
    ];
    
    return genericQuestions[index % genericQuestions.length];
  }
}
