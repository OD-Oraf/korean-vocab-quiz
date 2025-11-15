import {VocabListSelector} from './components/VocabListSelector';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import QuizSelectorPage from './pages/QuizSelectorPage.tsx';

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
