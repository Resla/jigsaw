import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Puzzle } from './pages/Puzzle';
import { MyPuzzles } from './pages/MyPuzzles';
import { CategoryPage } from './pages/CategoryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/my-puzzles" element={<MyPuzzles />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/puzzle/custom/:customId" element={<Puzzle />} />
      <Route path="/puzzle/:imageId" element={<Puzzle />} />
    </Routes>
  );
}

export default App;
