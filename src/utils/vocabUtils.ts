import { VocabItem } from '../types/vocab';

/**
 * Utility functions for vocab management
 */

// Validate vocab file structure
export const validateVocabFile = (data: any[]): data is VocabItem[] => {
  if (!Array.isArray(data)) return false;
  
  return data.every(item => 
    typeof item === 'object' &&
    typeof item.korean === 'string' &&
    typeof item.english === 'string' &&
    item.korean.length > 0 &&
    item.english.length > 0
  );
};

// Search vocab items
export const searchVocabItems = (items: VocabItem[], query: string): VocabItem[] => {
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.korean.toLowerCase().includes(lowerQuery) ||
    item.english.toLowerCase().includes(lowerQuery)
  );
};

// Get vocab statistics
export const getVocabStats = (items: VocabItem[]) => {
  return {
    totalItems: items.length,
    avgKoreanLength: items.reduce((sum, item) => sum + item.korean.length, 0) / items.length,
    avgEnglishLength: items.reduce((sum, item) => sum + item.english.length, 0) / items.length,
    uniqueKoreanChars: new Set(items.flatMap(item => [...item.korean])).size,
  };
};

// Merge multiple vocab lists
export const mergeVocabLists = (...lists: VocabItem[][]): VocabItem[] => {
  const seen = new Set<string>();
  const merged: VocabItem[] = [];
  
  for (const list of lists) {
    for (const item of list) {
      const key = `${item.korean}:${item.english}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
  }
  
  return merged;
};
