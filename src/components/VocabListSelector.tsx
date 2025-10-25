import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useVocabLists } from "../hooks/useVocabLists";

interface VocabListSelectorProps {
  onSelect: (listId: string) => void;
}

export function VocabListSelector({ onSelect }: VocabListSelectorProps) {
  const { vocabLists, isLoading, error } = useVocabLists();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-lg text-gray-600">Loading vocabulary lists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-lg text-red-600">Error loading vocabulary lists</div>
        <div className="text-sm text-gray-600 mt-2">{error.message}</div>
      </div>
    );
  }

  // Group lists by category
  const groupedLists = vocabLists.reduce((acc, list) => {
    const category = list.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(list);
    return acc;
  }, {} as Record<string, typeof vocabLists>);

  const categoryOrder = ['practice', 'restaurant', 'numbers', 'grammar', 'travel', 'emergency', 'other'];
  const categoryLabels = {
    practice: '📝 Practice',
    restaurant: '🍽️ Restaurant & Dining',
    numbers: '🔢 Numbers',
    grammar: '📚 Grammar',
    travel: '🌍 Travel & Daily Life',
    emergency: '🆘 Emergency',
    other: '📋 Other'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Korean Vocabulary Quiz
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Choose a topic to start practicing • {vocabLists.length} lists available
          </p>
        </CardHeader>
        <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {categoryOrder.map(category => {
            const lists = groupedLists[category];
            if (!lists || lists.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <div className="space-y-3">
                  {lists.map((list) => (
                    <div 
                      key={list.id}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                      onClick={() => onSelect(list.id)}
                    >
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold text-gray-800">{list.name}</h4>
                            {list.difficulty && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                list.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                list.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {list.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                          <p className="text-xs text-indigo-600 font-medium mt-2">{list.count} items</p>
                        </div>
                        <Button variant="outline" className="shrink-0">
                          Start →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
