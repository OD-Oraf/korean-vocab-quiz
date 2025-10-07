# Korean Vocabulary Quiz 🇰🇷

An interactive Korean vocabulary quiz application built with React, TypeScript, and Tailwind CSS. Test your Korean language skills with randomized multiple-choice questions and track your progress!

![Korean Vocab Quiz](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7+-purple.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4+-teal.svg)

## ✨ Features

- **Interactive Quiz Interface** - Clean, modern UI with smooth transitions
- **Randomized Questions** - Questions are shuffled for each quiz session
- **Real-time Feedback** - Immediate visual feedback for correct/incorrect answers
- **Progress Tracking** - Visual progress bar and score counter
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **TypeScript Support** - Full type safety and better developer experience
- **Performance Optimized** - Fast loading with Vite build system

## 🎯 Quiz Content

The quiz includes 15 essential Korean vocabulary items:
- Question words (무엇 - what)
- Daily items (물 - water, 음료 - beverage)
- Time expressions (저녁 - evening, 이번 - this time)
- Common verbs (읽다 - to read, 돕다 - to help, 열다 - to open)
- Everyday objects (문 - door, 영상 - video)

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd korean-vocab-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   or with yarn:
   ```bash
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 📁 Project Structure

```
korean-vocab-quiz/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   └── ui/            # Reusable UI components
│   │       ├── button.tsx # Customizable button component
│   │       └── card.tsx   # Card layout components
│   ├── lib/
│   │   └── utils.ts       # Utility functions
│   ├── App.tsx            # Main quiz application
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite build configuration
└── LEARNING_TODO.md       # Feature ideas for learning
```

## 🎨 Tech Stack

### Core Technologies
- **[React 19](https://react.dev/)** - UI library for building interactive interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better development experience
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI components
- **[Class Variance Authority](https://cva.style/)** - Component variant management
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and quality checks
- **[PostCSS](https://postcss.org/)** - CSS processing and optimization

## 🎮 How to Play

1. **Start the Quiz** - The app automatically shuffles questions when loaded
2. **Read the Korean Word** - Each question displays a Korean word or phrase
3. **Choose Your Answer** - Select from 4 multiple-choice options
4. **Get Feedback** - Correct answers turn green, incorrect ones turn red
5. **Continue** - Click "Next Question" to proceed
6. **View Results** - See your final score and motivational message
7. **Try Again** - Click "Try Again" to start a new randomized quiz

## 🔧 Customization

### Adding New Vocabulary

To add new vocabulary items, edit the `vocabList` array in `src/App.tsx`:

```typescript
const vocabList: VocabItem[] = [
    { 
        korean: '새로운 단어', 
        english: 'new word', 
        options: ['new word', 'old word', 'big word', 'small word'] 
    },
    // ... existing items
];
```

### Styling Modifications

The project uses Tailwind CSS for styling. You can:
- Modify colors in `tailwind.config.js`
- Update component styles in the respective `.tsx` files
- Add global styles in `src/index.css`

### Component Customization

UI components in `src/components/ui/` are highly customizable:
- **Button variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Button sizes**: `default`, `sm`, `lg`, `icon`
- **Card components**: Mix and match `Card`, `CardHeader`, `CardTitle`, `CardContent`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Vercel will automatically build and deploy your app

### Deploy to Netlify

1. Run `npm run build`
2. Drag the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)

### Deploy to GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy`

## 🤝 Contributing

This project is designed for learning frontend development. Check out `LEARNING_TODO.md` for feature ideas and learning opportunities!

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📚 Learning Resources

- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Vite Guide**: https://vitejs.dev/guide/

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Korean vocabulary sourced from common language learning materials
- UI components inspired by modern design systems
- Built with love for Korean language learners 💜

---

**Happy Learning! 화이팅! 🎉**
