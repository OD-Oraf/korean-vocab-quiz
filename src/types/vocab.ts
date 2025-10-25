/**
 * Shared vocabulary and quiz-related type definitions
 */

export interface VocabItem {
  id: string;
  korean: string;
  english: string;
  romanization?: string;
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'greeting' | 'phrase' | 'question' | 'expression';
  difficultyScore?: number; // 1-10 scale
  frequencyRank?: number; // How common this word is (lower = more common)
  notes?: string;
  audioFile?: string; // Path to pronunciation audio
  examples?: {
    korean: string;
    english: string;
  }[];
}

export interface QuizItem extends VocabItem {
  options: string[];
}

export interface VocabListMetadata {
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  author?: string;
  version?: string;
  lastUpdated?: string;
  estimatedMinutes?: number; // Time to complete this vocab list
  prerequisites?: string[]; // Vocab list IDs that should be learned first
  relatedLists?: string[]; // Similar or complementary vocab lists
  learningPath?: string; // Which learning path this belongs to
  source?: string; // Where the vocab came from
  totalItems?: number; // Auto-calculated from items array
}

export interface VocabList extends VocabListMetadata {
  id: string;
  count: number;
}

export interface VocabFileStructure {
  metadata: VocabListMetadata;
  items: VocabItem[];
}
