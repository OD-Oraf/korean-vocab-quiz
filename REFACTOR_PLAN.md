# Korean Vocab Quiz - Architecture Refactor Plan

## Current State Analysis

**Strengths:**
- ✅ Clean type definitions in `/types/vocab.ts`
- ✅ Modern tech stack (React 19, TypeScript, Vite, Tailwind)
- ✅ Component-based UI with shadcn/ui
- ✅ Routing with React Router

**Issues:**
- ❌ **Monolithic `App.tsx`** (312 lines) - quiz logic, routing, and components mixed
- ❌ **No separation of concerns** - business logic embedded in components
- ❌ **No custom hooks** - duplicated logic and state management
- ❌ **Hardcoded vocab lists** - metadata in `VocabListSelector.tsx`
- ❌ **No error handling** - silent failures on data loading
- ❌ **No testing infrastructure**

---

## 🏗️ Priority 1: Component Architecture (High Impact)

### **1. Split Monolithic App.tsx**

**Current Problem:** 300+ line file mixing routing, quiz logic, and UI.

**Recommendation:** Extract into focused components:

```
src/
├── pages/
│   ├── QuizPage.tsx           # Quiz container with routing logic
│   ├── ResultsPage.tsx        # Quiz completion page
│   └── SelectionPage.tsx      # Vocab list selection
├── components/
│   ├── Quiz/
│   │   ├── QuizContainer.tsx  # Main quiz orchestration
│   │   ├── QuestionCard.tsx   # Individual question display
│   │   ├── AnswerOptions.tsx  # Answer button grid
│   │   ├── QuizProgress.tsx   # Progress bar + score
│   │   └── QuizResults.tsx    # Results screen
│   ├── VocabListSelector.tsx
│   └── ui/
└── types/
```

**Benefits:** Better testability, reusability, and maintainability.

---

### **2. Create Custom Hooks (Critical)**

Extract repeated logic into reusable hooks:

```typescript
// src/hooks/useVocabLoader.ts
export const useVocabLoader = (listId: string | null) => {
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // ... loading logic
};

// src/hooks/useQuizState.ts
export const useQuizState = (vocabList: VocabItem[]) => {
  // Quiz state management
};

// src/hooks/useKeyboardNavigation.ts
export const useKeyboardNavigation = (onAnswer: (index: number) => void) => {
  // Keyboard controls (1-4 for answers, Enter for next)
};
```

---

## 🗂️ Priority 2: Data Layer (Medium Impact)

### **3. Centralize Vocab Metadata**

**Current Problem:** Vocab list metadata duplicated in component.

**Solution:** Create a data registry:

```typescript
// src/data/vocabRegistry.ts
import testSetData from './vocab/test-set.json';
import krServiceVocabData from './vocab/kr-service-vocab.json';
import { VocabItem, VocabList } from '../types/vocab';

export const VOCAB_LISTS: VocabList[] = [
  {
    id: 'test-set',
    name: 'Test Set',
    description: 'A small test vocabulary set',
    count: testSetData.length,
    data: testSetData as VocabItem[]
  },
  {
    id: 'kr-service-vocab',
    name: 'Korean Service Vocabulary',
    description: 'Common vocabulary for service situations',
    count: krServiceVocabData.length,
    data: krServiceVocabData as VocabItem[]
  }
];

export const getVocabListById = (id: string) => {
  return VOCAB_LISTS.find(list => list.id === id);
};
```

---

### **4. Add Utility Layer**

**Create `/utils` folder** for business logic:

```typescript
// src/utils/quizHelpers.ts
export const shuffleArray = <T>(array: T[]): T[] => { /* ... */ };
export const generateQuizItems = (vocab: VocabItem[]): QuizItem[] => { /* ... */ };
export const calculateScore = (answers: Answer[]): ScoreStats => { /* ... */ };

// src/utils/vocabHelpers.ts
export const filterByCategory = (vocab: VocabItem[], category: string) => { /* ... */ };
export const getRandomSubset = (vocab: VocabItem[], count: number) => { /* ... */ };
```

---

## 🎯 Priority 3: State Management (Medium Impact)

### **5. Implement Context for Settings**

**Add user preferences context:**

```typescript
// src/contexts/SettingsContext.tsx
interface Settings {
  soundEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timerEnabled: boolean;
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useLocalStorage('quiz-settings', DEFAULT_SETTINGS);
  // ...
};
```

---

### **6. Add Local Storage Hook**

```typescript
// src/hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Persistent state with type safety
};
```

---

## 🛡️ Priority 4: Error Handling & Loading (High Impact)

### **7. Add Error Boundaries**

```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends Component { /* ... */ }

// src/components/ErrorFallback.tsx
export const ErrorFallback = ({ error, resetError }) => {
  // User-friendly error display
};
```

---

### **8. Improve Loading States**

Replace generic "Loading..." with:
- **Skeleton loaders** for quiz card
- **Loading spinners** with progress
- **Error retry mechanisms**

---

## 🧪 Priority 5: Testing Infrastructure (Medium Priority)

### **9. Add Testing Setup**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// src/utils/__tests__/quizHelpers.test.ts
describe('shuffleArray', () => {
  it('should randomize array order', () => { /* ... */ });
});

// src/components/__tests__/QuestionCard.test.tsx
describe('QuestionCard', () => {
  it('should display korean word', () => { /* ... */ });
});
```

---

## 📊 Priority 6: Developer Experience (Low Priority)

### **10. Add Development Tools**

```bash
# Prettier for formatting
npm install -D prettier eslint-config-prettier

# Path aliases
# In tsconfig.json:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"]
    }
  }
}
```

---

## 🎨 Quick Wins (Implement First)

1. **Extract `QuizContainer` component** from `App.tsx` (1-2 hours)
2. **Create `useVocabLoader` hook** (30 mins)
3. **Move vocab metadata to `vocabRegistry.ts`** (30 mins)
4. **Add error boundaries** (1 hour)
5. **Extract utility functions** to `/utils` (1 hour)

---

## 📋 Recommended Implementation Order

```typescript
Week 1: Component Extraction
├── Extract QuizContainer, QuestionCard, QuizResults
├── Create useVocabLoader hook
└── Add basic error boundaries

Week 2: Data Layer
├── Create vocabRegistry.ts
├── Add utility functions
└── Implement useLocalStorage

Week 3: Polish
├── Add settings context
├── Improve loading states
└── Add keyboard navigation
```

---

## 🚀 Long-term Architecture Vision

```
src/
├── components/           # UI components
│   ├── Quiz/
│   ├── VocabList/
│   └── ui/
├── contexts/            # React Context providers
├── hooks/               # Custom hooks
├── pages/               # Route-level components
├── utils/               # Pure utility functions
├── data/                # Static data & loaders
├── types/               # TypeScript definitions
└── constants/           # App constants
```

---

## 📝 Implementation Notes

### Current Progress
- ✅ Started creating `/pages` directory structure
- 🔄 `QuizPage.tsx` created but needs proper props interface and logic extraction

### Next Steps
1. Fix `QuizPage.tsx` component interface and props
2. Extract quiz logic from `App.tsx` into custom hooks
3. Create proper component separation for quiz functionality
4. Implement error boundaries and loading states

### Key Considerations
- Maintain backward compatibility during refactor
- Ensure type safety throughout the process
- Test each component extraction individually
- Keep UI/UX consistent during architectural changes

---

**Status:** Planning Phase - Ready for Implementation
**Last Updated:** 2025-10-25
