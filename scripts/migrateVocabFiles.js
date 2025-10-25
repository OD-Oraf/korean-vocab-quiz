/**
 * Migration script to convert old-format vocab files to new metadata-in-JSON format
 * 
 * Usage: node scripts/migrateVocabFiles.js
 */

import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Old metadata from vocabRegistry (to be migrated into JSON files)
const LEGACY_METADATA = {
  'test-set': {
    name: 'Test Set',
    description: 'A small test vocabulary set for beginners',
    category: 'practice',
    difficulty: 'beginner'
  },
  'restaurant-basics': {
    name: '🍽️ Restaurant Basics',
    description: 'Essential greetings, ordering basics, and payment phrases',
    category: 'restaurant',
    difficulty: 'beginner'
  },
  'restaurant-ordering': {
    name: '📋 Restaurant Ordering',
    description: 'Detailed ordering phrases, special requests, and customization',
    category: 'restaurant',
    difficulty: 'intermediate'
  },
  'restaurant-food': {
    name: '🥘 Korean Food & Drinks',
    description: 'Popular Korean dishes, ingredients, and beverages',
    category: 'restaurant',
    difficulty: 'beginner'
  },
  'restaurant-grammar': {
    name: '📚 Restaurant Grammar Patterns',
    description: 'Essential grammar patterns: 주세요, 해주세요, ~할게요, and more',
    category: 'grammar',
    difficulty: 'intermediate'
  },
  'restaurant-requests': {
    name: '🍴 Restaurant Requests & Items',
    description: 'Utensils, amenities, feedback, and common questions',
    category: 'restaurant',
    difficulty: 'intermediate'
  },
  'numbers/native-korean-numbers': {
    name: '🔢 Native Korean Numbers',
    description: 'Native Korean numbers 1-99 with counters and examples',
    category: 'numbers',
    difficulty: 'beginner'
  },
  'transportation': {
    name: '🚇 Transportation',
    description: 'Subway, bus, taxi vocabulary and directions',
    category: 'travel',
    difficulty: 'intermediate'
  },
  'shopping': {
    name: '🛍️ Shopping',
    description: 'Shopping vocabulary, prices, and transactions',
    category: 'travel',
    difficulty: 'beginner'
  },
  'directions-time': {
    name: '🗺️ Directions & Time',
    description: 'Location words, time expressions, and navigation',
    category: 'travel',
    difficulty: 'intermediate'
  },
  'emergency-help': {
    name: '🆘 Emergency & Help',
    description: 'Essential emergency phrases and asking for help',
    category: 'emergency',
    difficulty: 'beginner'
  }
};

function inferTags(category, name) {
  const tags = [];
  
  // Add category as tag
  tags.push(category);
  
  // Infer from name
  if (name.includes('Basic')) tags.push('basics', 'beginner-friendly');
  if (name.includes('Grammar')) tags.push('grammar', 'patterns');
  if (name.includes('Food')) tags.push('food', 'dining');
  if (name.includes('Number')) tags.push('numbers', 'counting');
  if (name.includes('Emergency')) tags.push('emergency', 'essential');
  
  return tags;
}

function migrateVocabFile(fileId) {
  const vocabDir = join(__dirname, '../src/data/vocab');
  const filePath = join(vocabDir, `${fileId}.json`);
  
  try {
    // Read existing file
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Check if already migrated
    if (data.metadata && data.items) {
      console.log(`✅ ${fileId}: Already migrated`);
      return;
    }
    
    // Check if old format (plain array)
    if (!Array.isArray(data)) {
      console.log(`⚠️  ${fileId}: Unknown format, skipping`);
      return;
    }
    
    // Get metadata from legacy config
    const metadata = LEGACY_METADATA[fileId];
    if (!metadata) {
      console.log(`⚠️  ${fileId}: No metadata found, skipping`);
      return;
    }
    
    // Create new structure
    const newStructure = {
      metadata: {
        ...metadata,
        tags: inferTags(metadata.category, metadata.name),
        author: 'Korean Vocab Quiz',
        version: '2.0',
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      items: data
    };
    
    // Write back to file
    writeFileSync(
      filePath, 
      JSON.stringify(newStructure, null, 2) + '\n',
      'utf-8'
    );
    
    console.log(`✅ ${fileId}: Migrated (${data.length} items)`);
    
  } catch (error) {
    console.error(`❌ ${fileId}: Migration failed`, error.message);
  }
}

// Main execution
console.log('🚀 Starting vocab file migration...\n');

const fileIds = Object.keys(LEGACY_METADATA);
fileIds.forEach(fileId => {
  migrateVocabFile(fileId);
});

console.log('\n✨ Migration complete!');
console.log('\n📝 Next steps:');
console.log('1. Review migrated files');
console.log('2. Test in application');
console.log('3. Remove legacy metadata from vocabRegistry.ts');
console.log('4. Update documentation');
