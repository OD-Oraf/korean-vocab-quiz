# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript compile + Vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite is configured.

## Architecture

Two-route React SPA (React Router v7):

- `/` — `VocabListSelector` component, reads all vocab lists via `useVocabLists` hook and groups them by category
- `/quiz?list=<id>` — `QuizSelectorPage` dynamically imports the selected vocab JSON and renders `KoreanVocabQuiz`

### Data layer

Vocab content lives in `src/data/vocab/*.json`. Each file follows `VocabFileStructure` (see `src/types/vocab.ts`): a `metadata` object and an `items` array of `VocabItem`.

`src/data/vocabRegistry.ts` is the central registry:
- `VOCAB_LIST_IDS` — the authoritative list of active vocab file IDs (must be updated when adding/removing files)
- Uses `import.meta.glob('./vocab/**/*.json', { eager: true })` for Vite-time bundling
- Exposes async helpers: `getAllVocabLists`, `loadVocabData`, `getVocabListById`, plus filter/search utilities
- In-memory cache keyed by vocab ID

`src/hooks/useVocabLists.ts` wraps `getAllVocabLists` / `getVocabListsByCategory` in React state.

### Quiz logic

`KoreanVocabQuiz` receives a `VocabItem[]` prop. It shuffles the list, generates 4-option multiple-choice questions (correct answer + 3 random wrong answers from the same list), and tracks score. All state is local — no persistence.

### UI

shadcn/ui components (`src/components/ui/`) with Tailwind CSS v4. Path alias `@/` maps to `src/`.

## Key documentation

These link to the specific APIs and patterns used in this codebase:

**React**
- [useState](https://react.dev/reference/react/useState) / [useEffect](https://react.dev/reference/react/useEffect) — the two hooks used throughout; `useEffect` with a dependency array runs when those values change
- [Custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) — how `useVocabLists` is structured (wraps async logic in state)
- [TypeScript with React](https://react.dev/learn/typescript) — prop typing, `interface`, generics like `useState<VocabItem[]>`

**React Router v7**
- [useNavigate / useSearchParams](https://reactrouter.com/api/hooks/useSearchParams) — used in `QuizSelectorPage` to read `?list=` from the URL and navigate between routes
- [Routes & Route](https://reactrouter.com/start/framework/routing) — how `App.tsx` maps paths to components

**TypeScript**
- [Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html) — `VocabItem`, `VocabList`, etc. in `src/types/vocab.ts`
- [as const](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) — used on `VOCAB_LIST_IDS` to make the array values literal types
- [Type narrowing / type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) — the `Array.isArray` check in `vocabRegistry.ts` for old vs new file format

**Vite**
- [import.meta.glob](https://vite.dev/guide/features.html#glob-import) — how all vocab JSON files are bundled at build time without individual imports

**shadcn/ui**
- [Component docs](https://ui.shadcn.com/docs/components/button) — `Button`, `Card`, `CardHeader`, `CardContent`, `CardTitle` are the components in use; each page links to its API

**Tailwind CSS v4**
- [Utility class reference](https://tailwindcss.com/docs/styling-with-utility-classes) — the inline class strings on every JSX element (`flex`, `gap-4`, `text-lg`, etc.)

## Adding a new vocab list

1. Create `src/data/vocab/<id>.json` using the `VocabFileStructure` shape (see `src/data/vocab/vocab-template.json`)
2. Add the `id` string to `VOCAB_LIST_IDS` in `src/data/vocabRegistry.ts`
3. Add the category to `categoryOrder` / `categoryLabels` in `VocabListSelector.tsx` if it's a new category