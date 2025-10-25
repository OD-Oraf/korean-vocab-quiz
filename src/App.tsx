import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from './components/ui/card';
import {Button} from './components/ui/button';
import {VocabListSelector} from './components/VocabListSelector';
import {BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams} from 'react-router-dom';
import {VocabItem, QuizItem} from './types/vocab';

const QuizApp = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const listId = searchParams.get('list');
    const [vocabList, setVocabList] = useState<VocabItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (listId) {
            setIsLoading(true);
            import(`./data/vocab/${listId}.json`)
                .then(module => {
                    const data = module.default;
                    // Handle new structure with metadata and items
                    if (data.metadata && data.items) {
                        setVocabList(data.items);
                    } else if (Array.isArray(data)) {
                        // Fallback for old structure (plain array)
                        setVocabList(data);
                    } else {
                        console.error('Unknown vocab file structure');
                        setVocabList([]);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load vocabulary list:', err);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [listId]);

    const handleListSelect = (newListId: string) => {
        navigate(`/quiz?list=${newListId}`);
    };

    if (!listId) {
        return <VocabListSelector onSelect={handleListSelect}/>;
    }

    if (isLoading) {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="text-lg mb-4">Loading vocabulary list...</div>
                <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="mt-4"
                >
                    Back to Vocab Lists
                </Button>
            </div>
        );
    }

    if (vocabList.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="text-lg mb-4">No vocabulary list found</div>
                <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="mt-4"
                >
                    Back to Vocab Lists
                </Button>
            </div>
        );
    }

    return <KoreanVocabQuiz vocabList={vocabList} onBackToList={() => navigate('/')}/>;
};

interface KoreanVocabQuizProps {
    vocabList: VocabItem[];
    onBackToList: () => void;
}

const KoreanVocabQuiz = ({vocabList, onBackToList}: KoreanVocabQuizProps) => {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [quizComplete, setQuizComplete] = useState<boolean>(false);
    const [shuffledVocab, setShuffledVocab] = useState<QuizItem[]>([]);

    const shuffleArray = <T, >(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const generateRandomOptions = (correctAnswer: string, allAnswers: string[]): string[] => {
        const wrongAnswers = allAnswers.filter(answer => answer !== correctAnswer);
        const shuffledWrong = shuffleArray(wrongAnswers);
        const selectedWrong = shuffledWrong.slice(0, 3);
        const options = [correctAnswer, ...selectedWrong];
        return shuffleArray(options);
    };

    const shuffleQuiz = (): void => {
        const allEnglishAnswers = vocabList.map(item => item.english);
        const quizItems: QuizItem[] = vocabList.map(item => ({
            ...item,
            options: generateRandomOptions(item.english, allEnglishAnswers)
        }));

        setShuffledVocab(shuffleArray(quizItems));
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuizComplete(false);
    };

    useEffect(() => {
        if (vocabList.length > 0) {
            shuffleQuiz();
        }
    }, [vocabList]);

    const handleAnswer = (answer: string): void => {
        setSelectedAnswer(answer);
        setShowResult(true);

        if (answer === shuffledVocab[currentQuestion]?.english) {
            setScore(score + 1);
        }
    };

    const handleNext = (): void => {
        if (currentQuestion + 1 < shuffledVocab.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizComplete(true);
        }
    };

    const currentVocab = shuffledVocab[currentQuestion];

    if (shuffledVocab.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Loading quiz...</div>
            </div>
        );
    }

    if (quizComplete) {
        const percentage = Math.round((score / shuffledVocab.length) * 100);
        return (
            <div
                className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <Button
                    variant="ghost"
                    onClick={onBackToList}
                    className="self-start mb-4"
                >
                    ← Back to Vocab Lists
                </Button>
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Quiz Complete! 🎉</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <div className="text-6xl font-bold text-indigo-600">
                            {score} / {shuffledVocab.length}
                        </div>
                        <div className="text-2xl text-gray-700">
                            {percentage}% correct
                        </div>
                        <div className="text-lg text-gray-600">
                            {percentage >= 90 ? "Excellent work! 훌륭해요!" :
                                percentage >= 70 ? "Great job! 잘했어요!" :
                                    percentage >= 50 ? "Good effort! Keep practicing!" :
                                        "Keep studying! You'll improve! 화이팅!"}
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={shuffleQuiz}
                                className="bg-indigo-600 hover:bg-indigo-700 text-lg py-3 px-6"
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={onBackToList}
                                variant="outline"
                                className="text-lg py-3 px-6"
                            >
                                Choose Another List
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!currentVocab) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Loading quiz...</div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Button
                variant="ghost"
                onClick={onBackToList}
                className="self-start mb-4"
            >
                ← Back to Vocab Lists
            </Button>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            Question {currentQuestion + 1} of {shuffledVocab.length}
                        </span>
                        <span className="text-sm font-semibold text-indigo-600">
                            Score: {score}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{width: `${((currentQuestion + 1) / shuffledVocab.length) * 100}%`}}
                        />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <div className="text-5xl font-bold mb-4 text-gray-800">
                            {currentVocab.korean}
                        </div>
                        <div className="text-xl text-gray-600">
                            What does this mean?
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {currentVocab.options.map((option: string, index: number) => {
                            let buttonClass = "w-full p-4 text-lg rounded-lg border-2 transition-all ";

                            if (!showResult) {
                                buttonClass += "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50";
                            } else if (option === currentVocab.english) {
                                buttonClass += "border-green-500 bg-green-50 text-green-800";
                            } else if (option === selectedAnswer) {
                                buttonClass += "border-red-500 bg-red-50 text-red-800";
                            } else {
                                buttonClass += "border-gray-300 opacity-50";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => !showResult && handleAnswer(option)}
                                    disabled={showResult}
                                    className={buttonClass}
                                >
                                    {option}
                                    {showResult && option === currentVocab.english && " ✓"}
                                    {showResult && option === selectedAnswer && option !== currentVocab.english && " ✗"}
                                </button>
                            );
                        })}
                    </div>

                    {showResult && (
                        <div className="text-center space-y-4">
                            <div className={`text-xl font-semibold ${
                                selectedAnswer === currentVocab.english ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {selectedAnswer === currentVocab.english ? '정답! Correct!' : '틀렸어요. Incorrect!'}
                            </div>
                            <Button
                                onClick={handleNext}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6"
                            >
                                {currentQuestion + 1 < shuffledVocab.length ? 'Next Question' : 'See Results'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<VocabListSelector
                onSelect={(listId) => window.location.href = `/quiz?list=${listId}`}/>}/>
            <Route path="/quiz" element={<QuizApp/>}/>
        </Routes>
    </Router>
);

export default App;
