import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface VocabList {
  id: string;
  name: string;
  description: string;
  count: number;
}

interface VocabListSelectorProps {
  onSelect: (listId: string) => void;
}

const vocabLists: VocabList[] = [
  {
    id: 'test-set',
    name: 'Test Set',
    description: 'A small test vocabulary set',
    count: 5
  },
  {
    id: 'kr-service-vocab',
    name: 'Korean Service Vocabulary',
    description: 'Common vocabulary for service situations',
    count: 100
  }
];

export function VocabListSelector({ onSelect }: VocabListSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Select a Vocabulary List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vocabLists.map((list) => (
            <div 
              key={list.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onSelect(list.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{list.name}</h3>
                  <p className="text-sm text-gray-600">{list.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{list.count} words</p>
                </div>
                <Button variant="outline">
                  Start Quiz
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
