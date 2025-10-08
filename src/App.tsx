import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';

interface VocabItem {
    korean: string;
    english: string;
    options: string[];
}

const KoreanVocabQuiz = () => {
    const vocabList: VocabItem[] = [
        { korean: '무엇', english: 'what', options: ['what', 'where', 'when', 'who'] },
        { korean: '음료', english: 'beverage', options: ['beverage', 'food', 'water', 'tea'] },
        { korean: '저녁', english: 'evening/dinner', options: ['evening/dinner', 'morning', 'lunch', 'afternoon'] },
        { korean: '물', english: 'water', options: ['water', 'milk', 'juice', 'coffee'] },
        { korean: '곧', english: 'soon', options: ['soon', 'now', 'later', 'yesterday'] },
        { korean: '좀', english: 'a little/please', options: ['a little/please', 'very', 'too much', 'always'] },
        { korean: '가져다 주다', english: 'to bring (for someone)', options: ['to bring (for someone)', 'to take away', 'to throw', 'to buy'] },
        { korean: '만들다', english: 'to make', options: ['to make', 'to break', 'to eat', 'to drink'] },
        { korean: '읽다', english: 'to read', options: ['to read', 'to write', 'to speak', 'to listen'] },
        { korean: '돕다', english: 'to help', options: ['to help', 'to hurt', 'to ignore', 'to leave'] },
        { korean: '열다', english: 'to open', options: ['to open', 'to close', 'to lock', 'to break'] },
        { korean: '문', english: 'door', options: ['door', 'window', 'wall', 'floor'] },
        { korean: '이번', english: 'this time', options: ['this time', 'last time', 'next time', 'every time'] },
        { korean: '영상', english: 'video', options: ['video', 'photo', 'song', 'book'] },
        { korean: '이야기하다', english: 'to talk/discuss', options: ['to talk/discuss', 'to sleep', 'to walk', 'to run'] }
    ];

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [quizComplete, setQuizComplete] = useState<boolean>(false);
    const [shuffledVocab, setShuffledVocab] = useState<VocabItem[]>([]);

    useEffect(() => {
        shuffleQuiz();
    }, []);

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const shuffleQuiz = (): void => {
        const shuffled = shuffleArray(vocabList);
        setShuffledVocab(shuffled);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuizComplete(false);
    };

    const handleAnswer = (answer: string): void => {
        setSelectedAnswer(answer);
        setShowResult(true);

        if (answer === shuffledVocab[currentQuestion].english) {
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

    if (shuffledVocab.length === 0) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (quizComplete) {
        const percentage = Math.round((score / shuffledVocab.length) * 100);
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center">Quiz Complete! 🎉</CardTitle>
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
                        <Button
                            onClick={shuffleQuiz}
                            className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-700 text-lg py-6"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentVocab = shuffledVocab[currentQuestion];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
                            style={{ width: `${((currentQuestion + 1) / shuffledVocab.length) * 100}%` }}
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

export default KoreanVocabQuiz;
