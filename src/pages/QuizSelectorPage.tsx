import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {VocabItem} from "@/types/vocab.ts";
import {VocabListSelector} from "@/components/VocabListSelector.tsx";
import {Button} from "@/components/ui/button.tsx";
import KoreanVocabQuiz from '../components/KoreanVocabQuiz'

const QuizSelectorPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const listId = searchParams.get('list');
    const [vocabList, setVocabList] = useState<VocabItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (listId) {
            setIsLoading(true);
            import(`../data/vocab/${listId}.json`)
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

export default QuizSelectorPage;