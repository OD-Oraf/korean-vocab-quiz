import { useState, useEffect } from 'react';
import { VocabList } from '../types/vocab';
import { getAllVocabLists, getVocabListsByCategory } from '../data/vocabRegistry';

export const useVocabLists = (category?: string) => {
  const [vocabLists, setVocabLists] = useState<VocabList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadVocabLists = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const lists = category 
          ? await getVocabListsByCategory(category)
          : await getAllVocabLists();
        
        setVocabLists(lists);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load vocab lists'));
      } finally {
        setIsLoading(false);
      }
    };

    loadVocabLists();
  }, [category]);

  return { vocabLists, isLoading, error };
};
