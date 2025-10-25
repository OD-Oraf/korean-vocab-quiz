/**
 * Shared vocabulary and quiz-related type definitions
 */

export interface VocabItem {
  korean: string;
  english: string;
}

export interface QuizItem extends VocabItem {
  options: string[];
}

export interface VocabList {
  id: string;
  name: string;
  description: string;
  count: number;
}
