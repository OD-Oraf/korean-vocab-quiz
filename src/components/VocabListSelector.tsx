import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { VocabItem, VocabList } from "../types/vocab";
import testSetData from '../data/vocab/test-set.json';
import restaurantBasicsData from '../data/vocab/restaurant-basics.json';
import restaurantOrderingData from '../data/vocab/restaurant-ordering.json';
import restaurantFoodData from '../data/vocab/restaurant-food.json';
import restaurantGrammarData from '../data/vocab/restaurant-grammar.json';
import restaurantRequestsData from '../data/vocab/restaurant-requests.json';
import transportationData from '../data/vocab/transportation.json';
import shoppingData from '../data/vocab/shopping.json';
import directionsTimeData from '../data/vocab/directions-time.json';
import emergencyHelpData from '../data/vocab/emergency-help.json';


interface VocabListSelectorProps {
  onSelect: (listId: string) => void;
}

const calculateVocabListSize = (vocabList: VocabItem[]): number => {
  return vocabList.length;
}


const vocabLists: VocabList[] = [
  {
    id: 'test-set',
    name: 'Test Set',
    description: 'A small test vocabulary set for beginners',
    count: calculateVocabListSize(testSetData as VocabItem[])
  },
  {
    id: 'restaurant-basics',
    name: '🍽️ Restaurant Basics',
    description: 'Essential greetings, ordering basics, and payment phrases',
    count: calculateVocabListSize(restaurantBasicsData as VocabItem[])
  },
  {
    id: 'restaurant-ordering',
    name: '📋 Restaurant Ordering',
    description: 'Detailed ordering phrases, special requests, and customization',
    count: calculateVocabListSize(restaurantOrderingData as VocabItem[])
  },
  {
    id: 'restaurant-food',
    name: '🥘 Korean Food & Drinks',
    description: 'Popular Korean dishes, ingredients, and beverages',
    count: calculateVocabListSize(restaurantFoodData as VocabItem[])
  },
  {
    id: 'restaurant-grammar',
    name: '📚 Restaurant Grammar Patterns',
    description: 'Essential grammar patterns: 주세요, 해주세요, ~할게요, and more',
    count: calculateVocabListSize(restaurantGrammarData as VocabItem[])
  },
  {
    id: 'restaurant-requests',
    name: '🍴 Restaurant Requests & Items',
    description: 'Utensils, amenities, feedback, and common questions',
    count: calculateVocabListSize(restaurantRequestsData as VocabItem[])
  },
  {
    id: 'transportation',
    name: '🚇 Transportation',
    description: 'Subway, bus, taxi vocabulary and directions',
    count: calculateVocabListSize(transportationData as VocabItem[])
  },
  {
    id: 'shopping',
    name: '🛍️ Shopping',
    description: 'Shopping vocabulary, prices, and transactions',
    count: calculateVocabListSize(shoppingData as VocabItem[])
  },
  {
    id: 'directions-time',
    name: '🗺️ Directions & Time',
    description: 'Location words, time expressions, and navigation',
    count: calculateVocabListSize(directionsTimeData as VocabItem[])
  },
  {
    id: 'emergency-help',
    name: '🆘 Emergency & Help',
    description: 'Essential emergency phrases and asking for help',
    count: calculateVocabListSize(emergencyHelpData as VocabItem[])
  }
];

export function VocabListSelector({ onSelect }: VocabListSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Korean Vocabulary Quiz
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Choose a topic to start practicing
          </p>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {vocabLists.map((list) => (
            <div 
              key={list.id}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => onSelect(list.id)}
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{list.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                  <p className="text-xs text-indigo-600 font-medium mt-2">{list.count} items</p>
                </div>
                <Button variant="outline" className="shrink-0">
                  Start →
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
