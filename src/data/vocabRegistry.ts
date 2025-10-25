import { VocabItem, VocabList, VocabFileStructure } from '../types/vocab';

/**
 * Registry of available vocab list IDs
 * Just list the file paths here - metadata comes from the JSON files themselves
 */
export const VOCAB_LIST_IDS = [
  'test-set',
  'restaurant-basics',
  'restaurant-ordering',
  'restaurant-food',
  'restaurant-grammar',
  'restaurant-requests',
  'numbers/native-korean-numbers',
  'transportation',
  'shopping',
  'directions-time',
  'emergency-help'
] as const;

// Type helper for vocab list IDs
export type VocabListId = typeof VOCAB_LIST_IDS[number];

/**
 * Load vocab file and extract metadata + items
 */
const loadVocabFile = async (fileId: string): Promise<VocabFileStructure | null> => {
  try {
    const module = await import(`./vocab/${fileId}.json`);
    const data = module.default;
    
    // Check if file has new structure with metadata
    if (data.metadata && data.items) {
      return data as VocabFileStructure;
    }
    
    // Fallback: old structure (plain array) - generate metadata
    if (Array.isArray(data)) {
      return {
        metadata: {
          name: fileId.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || fileId,
          description: 'Vocabulary list',
          category: 'other',
          difficulty: 'intermediate'
        },
        items: data as VocabItem[]
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to load vocab file: ${fileId}`, error);
    return null;
  }
};

// Cache for loaded vocab files
const vocabCache = new Map<string, VocabFileStructure>();

/**
 * Load vocab data (items only) with caching
 */
export const loadVocabData = async (vocabId: string): Promise<VocabItem[]> => {
  const fileData = await loadVocabFile(vocabId);
  if (!fileData) return [];
  
  vocabCache.set(vocabId, fileData);
  return fileData.items;
};

/**
 * Get all vocab lists with metadata from JSON files
 */
export const getAllVocabLists = async (): Promise<VocabList[]> => {
  const lists = await Promise.all(
    VOCAB_LIST_IDS.map(async (id) => {
      const fileData = await loadVocabFile(id);
      if (!fileData) return null;
      
      return {
        id,
        ...fileData.metadata,
        count: fileData.items.length,
        // Auto-calculate totalItems if not present in metadata
        totalItems: fileData.metadata.totalItems || fileData.items.length
      } as VocabList;
    })
  );
  
  // Filter out failed loads
  return lists.filter((list): list is VocabList => list !== null);
};

/**
 * Get vocab lists by category
 */
export const getVocabListsByCategory = async (category: string): Promise<VocabList[]> => {
  const allLists = await getAllVocabLists();
  return allLists.filter(list => list.category === category);
};

/**
 * Get single vocab list by ID with metadata
 */
export const getVocabListById = async (id: string): Promise<VocabList | null> => {
  if (!VOCAB_LIST_IDS.includes(id as VocabListId)) {
    return null;
  }
  
  const fileData = await loadVocabFile(id);
  if (!fileData) return null;
  
  return {
    id,
    ...fileData.metadata,
    count: fileData.items.length
  };
};

/**
 * Get full file structure (metadata + items)
 */
export const getVocabFileStructure = async (id: string): Promise<VocabFileStructure | null> => {
  if (vocabCache.has(id)) {
    return vocabCache.get(id)!;
  }
  return loadVocabFile(id);
};

/**
 * Get vocab lists by learning path
 */
export const getVocabListsByLearningPath = async (learningPath: string): Promise<VocabList[]> => {
  const allLists = await getAllVocabLists();
  return allLists.filter(list => list.learningPath === learningPath);
};

/**
 * Get vocab lists by difficulty level
 */
export const getVocabListsByDifficulty = async (difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<VocabList[]> => {
  const allLists = await getAllVocabLists();
  return allLists.filter(list => list.difficulty === difficulty);
};

/**
 * Get vocab items by difficulty score range
 */
export const getVocabItemsByDifficulty = async (vocabId: string, minScore: number, maxScore: number): Promise<VocabItem[]> => {
  const fileData = await loadVocabFile(vocabId);
  if (!fileData) return [];
  
  return fileData.items.filter(item => {
    const score = item.difficultyScore || 5; // Default to medium difficulty
    return score >= minScore && score <= maxScore;
  });
};

/**
 * Get vocab items sorted by frequency (most common first)
 */
export const getVocabItemsByFrequency = async (vocabId: string): Promise<VocabItem[]> => {
  const fileData = await loadVocabFile(vocabId);
  if (!fileData) return [];
  
  return fileData.items.sort((a, b) => {
    const aRank = a.frequencyRank || 999;
    const bRank = b.frequencyRank || 999;
    return aRank - bRank;
  });
};

/**
 * Search for vocab items across all lists by Korean or English text
 */
export const searchVocabItems = async (searchTerm: string): Promise<Array<VocabItem & { listId: string }>> => {
  const results: Array<VocabItem & { listId: string }> = [];
  const searchLower = searchTerm.toLowerCase();
  
  for (const listId of VOCAB_LIST_IDS) {
    const fileData = await loadVocabFile(listId);
    if (!fileData) continue;
    
    const matchingItems = fileData.items.filter(item =>
      item.korean.toLowerCase().includes(searchLower) ||
      item.english.toLowerCase().includes(searchLower) ||
      (item.romanization && item.romanization.toLowerCase().includes(searchLower))
    );
    
    results.push(...matchingItems.map(item => ({ ...item, listId })));
  }
  
  return results;
};

/**
 * Validate vocab file structure
 */
export const validateVocabFile = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check metadata
  if (!data.metadata) {
    errors.push('Missing metadata object');
  } else {
    if (!data.metadata.name) errors.push('Missing metadata.name');
    if (!data.metadata.description) errors.push('Missing metadata.description');
    if (!data.metadata.category) errors.push('Missing metadata.category');
    if (!data.metadata.difficulty) errors.push('Missing metadata.difficulty');
  }
  
  // Check items
  if (!Array.isArray(data.items)) {
    errors.push('Items must be an array');
  } else {
    data.items.forEach((item: any, index: number) => {
      if (!item.id) errors.push(`Item ${index}: Missing id`);
      if (!item.korean) errors.push(`Item ${index}: Missing korean text`);
      if (!item.english) errors.push(`Item ${index}: Missing english text`);
      
      // Check for duplicate IDs
      const duplicateId = data.items.find((other: any, otherIndex: number) => 
        otherIndex !== index && other.id === item.id
      );
      if (duplicateId) {
        errors.push(`Item ${index}: Duplicate id "${item.id}"`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
