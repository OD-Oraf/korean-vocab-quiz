# Metadata-in-JSON Architecture Guide

## 🎯 Design Philosophy

**Problem:** The original design had metadata scattered between JSON files and TypeScript config.

**Solution:** Store all metadata directly in JSON files for true portability and zero-config vocab lists.

---

## 📊 Comparison

### **❌ Old Approach (Tightly Coupled)**

```typescript
// vocabRegistry.ts - Metadata in code
export const VOCAB_LIST_CONFIGS = [
  {
    id: 'restaurant-basics',
    name: '🍽️ Restaurant Basics',
    description: 'Essential phrases...',
    category: 'restaurant',
    difficulty: 'beginner'
  }
];
```

```json
// restaurant-basics.json - Just data
[
  { "korean": "안녕하세요", "english": "hello" }
]
```

**Issues:**
- ❌ Metadata separated from data
- ❌ Requires code changes to update metadata
- ❌ Not portable (can't share just the JSON)
- ❌ Duplicate source of truth

---

### **✅ New Approach (Self-Contained)**

```json
// restaurant-basics.json - Metadata + Data together
{
  "metadata": {
    "name": "🍽️ Restaurant Basics",
    "description": "Essential phrases...",
    "category": "restaurant",
    "difficulty": "beginner",
    "tags": ["dining", "food", "basics"],
    "author": "Korean Vocab Quiz",
    "version": "2.0",
    "lastUpdated": "2025-10-25"
  },
  "items": [
    { "korean": "안녕하세요", "english": "hello" }
  ]
}
```

```typescript
// vocabRegistry.ts - Just IDs
export const VOCAB_LIST_IDS = [
  'restaurant-basics'  // That's it!
];
```

**Benefits:**
- ✅ Metadata stays with data
- ✅ Fully self-contained files
- ✅ Portable (share/download single file)
- ✅ Single source of truth
- ✅ No code changes for metadata updates
- ✅ Backward compatible with old format

---

## 🏗️ New JSON Structure

### **Full Structure**

```json
{
  "metadata": {
    "name": "🍽️ Display Name",
    "description": "Detailed description of the list",
    "category": "restaurant",
    "difficulty": "beginner",
    "tags": ["optional", "searchable", "keywords"],
    "author": "Creator Name",
    "version": "1.0",
    "lastUpdated": "2025-10-25"
  },
  "items": [
    { "korean": "한국어", "english": "Korean" },
    { "korean": "영어", "english": "English" }
  ]
}
```

### **Required Fields**

```typescript
metadata: {
  name: string;           // Display name (supports emojis)
  description: string;    // User-facing description
  category: string;       // Grouping category
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

items: VocabItem[];       // Array of vocab entries
```

### **Optional Fields**

```typescript
metadata: {
  tags?: string[];        // Searchable keywords
  author?: string;        // Creator attribution
  version?: string;       // Version tracking
  lastUpdated?: string;   // ISO date string
}
```

---

## 🚀 Adding New Vocab Lists

### **Step 1: Create JSON File**

```bash
# Create new file with metadata + items
touch src/data/vocab/business-korean.json
```

### **Step 2: Add Content**

```json
{
  "metadata": {
    "name": "💼 Business Korean",
    "description": "Professional vocabulary for workplace",
    "category": "business",
    "difficulty": "advanced",
    "tags": ["work", "professional", "office"],
    "author": "Your Name",
    "version": "1.0",
    "lastUpdated": "2025-10-25"
  },
  "items": [
    { "korean": "회의", "english": "meeting" },
    { "korean": "보고서", "english": "report" }
  ]
}
```

### **Step 3: Register ID**

```typescript
// vocabRegistry.ts - Add ONE line
export const VOCAB_LIST_IDS = [
  // ... existing IDs
  'business-korean'  // Just add the file name!
];
```

### **That's it! ✨**

The system automatically:
- Reads metadata from JSON
- Calculates item count
- Groups by category
- Displays correctly in UI

---

## 🔄 Migration from Old Format

### **Automatic Fallback**

The system supports **both formats**:

```typescript
// Old format (array) - Still works!
[
  { "korean": "word", "english": "translation" }
]

// New format (object with metadata) - Preferred
{
  "metadata": { ... },
  "items": [ ... ]
}
```

### **Migration Script**

```bash
# TODO: Create migration utility
npm run migrate-vocab-files
```

This will:
1. Detect old-format files
2. Extract metadata from vocabRegistry.ts
3. Restructure as new format
4. Update all JSON files

---

## 💡 Use Cases Enabled

### **1. Portable Vocab Packs**

```bash
# Share a single self-contained file
curl -O https://example.com/korean-slang.json

# Drop it in vocab folder
mv korean-slang.json src/data/vocab/

# Add ID to registry - Done!
```

### **2. Community Contributions**

Users can create vocab lists with:
- No code knowledge required
- Just JSON editing
- Complete metadata included
- Easy to share/submit

### **3. Dynamic Loading**

```typescript
// Future: Load from external sources
async function loadExternalVocab(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  // Validates and loads automatically!
}
```

### **4. Versioning & Updates**

```json
{
  "metadata": {
    "version": "2.1",
    "lastUpdated": "2025-10-25"
  }
}
```

Track changes, manage updates, show "New!" badges.

### **5. Advanced Metadata**

```json
{
  "metadata": {
    "tags": ["beginner-friendly", "common-phrases"],
    "author": "Korean Teacher",
    "license": "CC-BY-4.0",
    "sourceUrl": "https://example.com",
    "estimatedTime": "30 minutes",
    "prerequisites": ["test-set"]
  }
}
```

---

## 🎨 UI Enhancements

### **Metadata Display**

```tsx
// Automatic from JSON metadata
<VocabCard>
  <h3>{metadata.name}</h3>  {/* 🍽️ Restaurant Basics */}
  <p>{metadata.description}</p>
  <Badge>{metadata.difficulty}</Badge>
  {metadata.tags.map(tag => <Tag>{tag}</Tag>)}
  <small>by {metadata.author}</small>
</VocabCard>
```

### **Search & Filter**

```typescript
// Search by tags
const foodLists = vocabLists.filter(list => 
  list.tags?.includes('food')
);

// Filter by author
const myLists = vocabLists.filter(list =>
  list.author === 'Your Name'
);
```

---

## 📁 Recommended File Organization

```
src/data/vocab/
├── basics/
│   ├── greetings.json        # With metadata
│   └── numbers.json          # With metadata
├── restaurant/
│   ├── ordering.json
│   ├── food.json
│   └── grammar.json
├── business/
│   ├── office.json
│   └── meetings.json
└── test-set.json             # Old format (still works)
```

---

## 🔍 Validation

The system validates:

```typescript
✅ metadata.name exists
✅ metadata.description exists
✅ metadata.category is string
✅ metadata.difficulty is valid enum
✅ items is array of VocabItem
✅ Each item has korean + english
```

Invalid files are:
- Logged to console
- Skipped gracefully
- Don't break the app

---

## 🎯 Best Practices

### **1. Descriptive Metadata**

```json
❌ "description": "Korean words"
✅ "description": "Essential Korean vocabulary for ordering food in restaurants"
```

### **2. Accurate Categories**

```json
✅ Use: "restaurant", "travel", "business", "grammar", "numbers"
❌ Avoid: "misc", "other", "random"
```

### **3. Meaningful Tags**

```json
✅ "tags": ["beginner-friendly", "daily-conversation", "polite-speech"]
❌ "tags": ["tag1", "korean", "vocab"]
```

### **4. Keep Updated**

```json
{
  "metadata": {
    "version": "2.1",
    "lastUpdated": "2025-10-25"  // Update when you edit
  }
}
```

---

## 🚧 Future Enhancements

### **1. Vocab Marketplace**

```typescript
// Browse community-created vocab
<VocabMarketplace>
  <VocabPack 
    file="korean-slang.json"
    author="Cool Teacher"
    downloads={1234}
    rating={4.8}
  />
</VocabMarketplace>
```

### **2. Online Editor**

```typescript
// Web-based vocab creator
<VocabEditor>
  <MetadataForm />
  <ItemsEditor />
  <ExportButton />  // Download JSON
</VocabEditor>
```

### **3. Auto-Discovery**

```typescript
// Automatically find all .json files
// No manual ID registration needed!
const allVocabFiles = import.meta.glob('./vocab/**/*.json');
```

### **4. Validation CLI**

```bash
npm run validate-vocab restaurant-basics.json
✅ Valid structure
✅ All required fields present
ℹ️  Found 38 items
```

---

## 📊 Migration Status

| File | Status | Notes |
|------|--------|-------|
| test-set.json | ⏳ Old format | Works with fallback |
| restaurant-basics.json | ⏳ Old format | Works with fallback |
| restaurant-basics-v2.json | ✅ New format | Example implementation |
| All others | ⏳ Old format | Pending migration |

---

## ✨ Summary

**Key Improvement:** Metadata lives with data, not in code.

**Benefits:**
- 📦 Portable vocab files
- 🔧 Zero-config adding
- 👥 Community-friendly
- 🎨 Richer metadata
- 🔄 Easy updates
- 📱 API-ready

**Migration:** Backward compatible - old format still works!

**Next Steps:** Migrate existing files to new format for full benefits.

---

**Status:** ✅ Architecture Complete  
**Backward Compatibility:** ✅ Yes  
**Migration Required:** Optional (recommended)
