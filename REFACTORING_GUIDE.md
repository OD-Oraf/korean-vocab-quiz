# QuizApp Refactoring Guide

## Overview
This guide walks through refactoring the `QuizApp` function from `src/App.tsx` to its own page in `src/pages/QuizSelectorPage.tsx`, while extracting the quiz component for better code organization.

## Step-by-Step Refactoring Guide

### Step 1: Extract KoreanVocabQuiz to its own component

**Create:** `src/components/KoreanVocabQuiz.tsx`

**What to move:**
- The `KoreanVocabQuizProps` interface (lines 9-12 from App.tsx)
- The entire `KoreanVocabQuiz` component (lines 92-310 from App.tsx)

**What to import:**
- React hooks: `useState`, `useEffect`
- UI components: `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Button`
- Types: `VocabItem`, `QuizItem` from `@/types/vocab` (or `../types/vocab`)
- Export the component as default

**Why separate?** This makes the component reusable and keeps files focused on single responsibilities.

**React Docs Reference:**
- [Extracting Components](https://react.dev/learn/your-first-component#nesting-and-organizing-components)
- [TypeScript with React Components](https://react.dev/learn/typescript#typescript-with-react-components)

---

### Step 2: Fix QuizSelectorPage.tsx

**Imports to add:**
```typescript
import KoreanVocabQuiz from '@/components/KoreanVocabQuiz'
// or use relative path:
import KoreanVocabQuiz from '../components/KoreanVocabQuiz'
```

**Fix the import path on line 17:**
```typescript
// Current (wrong):
import(`./data/vocab/${listId}.json`)

// Should be:
import(`../data/vocab/${listId}.json`)  // Note: ../ instead of ./
```

**Why?** The file is now in `src/pages/`, so you need to go up one directory to reach `src/data/`.

**React Docs Reference:**
- [Dynamic Imports in React](https://react.dev/reference/react/lazy)

---

### Step 3: Clean up App.tsx

**What to remove:**
- Lines 9-12 (`KoreanVocabQuizProps` interface)
- Lines 14-89 (`QuizApp` component) - already in QuizSelectorPage
- Lines 92-310 (`KoreanVocabQuiz` component) - will be in its own file

**What to keep/update:**
- The `Router` and `Routes` setup
- Import `QuizSelectorPage` (you already have this on line 7)

**Simplified App.tsx should look like:**
```typescript
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {VocabListSelector} from './components/VocabListSelector';
import QuizSelectorPage from './pages/QuizSelectorPage';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<VocabListSelector
                onSelect={(listId) => window.location.href = `/quiz?list=${listId}`}
            />}/>
            <Route path="/quiz" element={<QuizSelectorPage/>}/>
        </Routes>
    </Router>
);

export default App;
```

**React Router Docs Reference:**
- [React Router Overview](https://reactrouter.com/en/main/start/overview)
- [Route Configuration](https://reactrouter.com/en/main/route/route)

---

### Step 4: Verify import path consistency

**Check your tsconfig.json** for path aliases. You're using `@/` in QuizSelectorPage.tsx but `./` in App.tsx. Pick one:

- **If using `@/` alias:** Update all imports to use it consistently
- **If using relative paths:** Change QuizSelectorPage imports to `../`

**Common tsconfig.json setup for `@/` alias:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**If using Vite**, also add to `vite.config.ts`:
```typescript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**TypeScript Docs Reference:**
- [Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)

---

### Step 5: Test the refactoring

**Test cases to verify:**
1. Navigate to `/` - should show VocabListSelector
2. Select a list - should navigate to `/quiz?list=<id>` and load the quiz
3. Complete a quiz - should show results
4. "Back to Vocab Lists" button - should navigate to `/`

**React Docs Reference:**
- [Testing React Components](https://react.dev/learn/testing)

---

## Order of Operations

Do it in this sequence to avoid breaking the app:

1. **First:** Create `KoreanVocabQuiz.tsx` component (don't delete from App.tsx yet)
2. **Second:** Import it in QuizSelectorPage.tsx and fix the data import path
3. **Third:** Test that the quiz page works
4. **Fourth:** Clean up App.tsx by removing the duplicated code
5. **Fifth:** Test everything again

This way, you can roll back easily if something breaks.

---

## Final File Structure

```
src/
  ├── App.tsx                      # Router setup only
  ├── pages/
  │   └── QuizSelectorPage.tsx    # Quiz page logic (QuizApp)
  ├── components/
  │   ├── KoreanVocabQuiz.tsx     # Quiz component (extracted)
  │   ├── VocabListSelector.tsx
  │   └── ui/
  │       ├── card.tsx
  │       └── button.tsx
  ├── types/
  │   └── vocab.ts
  └── data/
      └── vocab/
          └── *.json
```

---

## Common Pitfalls to Avoid

- **Path aliases not working?** Make sure vite.config.ts (or webpack config) also defines the alias, not just tsconfig.json
- **Import errors?** Check that you're exporting components as default vs named exports
- **Quiz not loading?** The `../data/vocab/` path fix is critical
- **TypeScript errors?** Ensure all type imports are included in the new files

---

## Additional Resources

**React Documentation:**
- [React Components and Props](https://react.dev/learn/passing-props-to-a-component)
- [useState Hook](https://react.dev/reference/react/useState)
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [React Router Hooks](https://reactrouter.com/en/main/hooks/use-navigate)

**Best Practices:**
- [Component Composition](https://react.dev/learn/thinking-in-react)
- [File Structure](https://react.dev/learn/thinking-in-react#step-1-break-the-ui-into-a-component-hierarchy)

---

## Questions or Issues?

If you encounter any problems during refactoring:
1. Check the browser console for errors
2. Verify all import paths are correct
3. Ensure TypeScript types are properly imported
4. Test each step incrementally

Good luck with the refactoring!