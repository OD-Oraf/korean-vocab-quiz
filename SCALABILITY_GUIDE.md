# Scalability Guide: Adding New Vocabulary Lists

## 🎯 Overview
The vocabulary system has been redesigned for easy scalability. Adding new vocab lists now requires minimal code changes.

---

## 📁 File Structure (New)
```
src/
├── data/
│   ├── vocabRegistry.ts          # ✨ Central registry (main config)
│   └── vocab/
│       ├── category1/
│       │   ├── list1.json
│       │   └── list2.json
│       ├── category2/
│       │   └── list3.json
│       └── standalone-list.json
├── hooks/
│   └── useVocabLists.ts          # ✨ Data loading hook
├── utils/
│   └── vocabUtils.ts             # ✨ Utility functions
└── components/
    └── VocabListSelector.tsx     # ✨ Auto-loading component
```

---

## 🚀 How to Add New Vocabulary Lists

### **Step 1: Create the JSON file**
```bash
# Create in appropriate category folder
touch src/data/vocab/numbers/sino-korean-numbers.json
# OR create standalone
touch src/data/vocab/business-korean.json
```

### **Step 2: Add to registry (ONLY place to edit)**
Edit `src/data/vocabRegistry.ts`:

```typescript
export const VOCAB_LIST_CONFIGS: Omit<VocabList, 'count'>[] = [
  // ... existing lists ...
  {
    id: 'numbers/sino-korean-numbers',  // matches file path
    name: '🔢 Sino-Korean Numbers',
    description: 'Chinese-origin numbers used for dates, money, etc.',
    category: 'numbers',
    difficulty: 'intermediate'
  },
  {
    id: 'business-korean',
    name: '💼 Business Korean',
    description: 'Professional vocabulary for workplace situations',
    category: 'business',
    difficulty: 'advanced'
  }
];
```

### **Step 3: That's it! 🎉**
The system automatically:
- ✅ Loads the JSON file
- ✅ Calculates item count
- ✅ Groups by category
- ✅ Shows difficulty badges
- ✅ Handles loading states
- ✅ Provides error handling

---

## 🏗️ Architecture Benefits

### **Before (Non-scalable)**
```typescript
// ❌ Had to manually import every file
import list1 from './vocab/list1.json';
import list2 from './vocab/list2.json';
// ... 20+ imports

// ❌ Had to manually define each list
const vocabLists = [
  { id: 'list1', name: '...', count: list1.length },
  { id: 'list2', name: '...', count: list2.length },
  // ... 20+ definitions
];
```

### **After (Scalable)**
```typescript
// ✅ Single configuration file
export const VOCAB_LIST_CONFIGS = [
  { id: 'list1', name: '...', category: 'restaurant' },
  // Add new lists here only
];

// ✅ Dynamic loading
const { vocabLists } = useVocabLists();
```

---

## 🎨 UI Features (Automatic)

### **Category Grouping**
Lists are automatically grouped by category:
- 📝 Practice
- 🍽️ Restaurant & Dining  
- 🔢 Numbers
- 📚 Grammar
- 🌍 Travel & Daily Life
- 🆘 Emergency

### **Difficulty Badges**
- 🟢 **Beginner** - Green badge
- 🟡 **Intermediate** - Yellow badge  
- 🔴 **Advanced** - Red badge

### **Loading States**
- Loading spinner while fetching lists
- Error handling with retry options
- Graceful fallbacks

---

## 🔧 Advanced Features

### **Category Filtering**
```typescript
// Load only restaurant lists
const { vocabLists } = useVocabLists('restaurant');
```

### **Search & Statistics**
```typescript
import { searchVocabItems, getVocabStats } from '../utils/vocabUtils';

// Search within vocab
const results = searchVocabItems(vocabData, '음식');

// Get statistics
const stats = getVocabStats(vocabData);
```

### **Caching**
- Vocab files are cached after first load
- No redundant network requests
- Faster subsequent access

---

## 📋 Best Practices

### **File Naming**
```bash
✅ restaurant-basics.json
✅ numbers/native-korean.json
✅ grammar/verb-conjugations.json

❌ RestaurantBasics.json
❌ restaurant_basics.json
❌ numbers-native-korean.json (use folders for categories)
```

### **Category Organization**
```typescript
✅ Use consistent categories:
- 'restaurant', 'numbers', 'grammar', 'travel', 'business'

❌ Avoid:
- 'restaurants', 'number', 'grammars' (inconsistent pluralization)
```

### **Difficulty Levels**
```typescript
✅ Use standard levels:
- 'beginner' - Basic everyday vocabulary
- 'intermediate' - Complex phrases, grammar patterns  
- 'advanced' - Professional, literary, specialized terms

❌ Avoid custom levels like 'easy', 'hard', 'expert'
```

---

## 🚀 Future Enhancements

### **Planned Features**
1. **Admin Panel** - GUI for adding vocab lists
2. **Import/Export** - Bulk vocab management
3. **User Collections** - Custom vocab lists
4. **Progress Tracking** - Per-list completion stats
5. **Spaced Repetition** - Smart review scheduling

### **API Integration**
```typescript
// Future: Load from external API
export const loadVocabFromAPI = async (listId: string) => {
  const response = await fetch(`/api/vocab/${listId}`);
  return response.json();
};
```

---

## 📊 Current Stats
- **Lists**: 11 vocabulary lists
- **Items**: 400+ vocabulary items
- **Categories**: 6 main categories
- **Languages**: Korean ↔ English

---

## 🎯 Migration Checklist

When adding new vocab lists:

- [ ] Create JSON file in appropriate folder
- [ ] Add entry to `VOCAB_LIST_CONFIGS`
- [ ] Test loading in development
- [ ] Verify category grouping
- [ ] Check difficulty badge display
- [ ] Confirm item count accuracy

**That's it!** The system handles everything else automatically.

---

**Status:** ✅ Production Ready  
**Last Updated:** 2025-10-25  
**Maintainer:** Korean Vocab Quiz Team
