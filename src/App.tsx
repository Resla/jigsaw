import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Puzzle } from './pages/Puzzle';
import { MyPuzzles } from './pages/MyPuzzles';
import { CategoryPage } from './pages/CategoryPage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryStrip } from './pages/StoryStrip';
import { PlayTogether } from './pages/PlayTogether';
import { SpotItPage } from './pages/SpotItPage';
import { SpotItPlay } from './pages/SpotItPlay';
import { DailyPage } from './pages/DailyPage';
import { DAILY_PATH } from './engine/dailyChallenge';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/my-puzzles" element={<MyPuzzles />} />
      <Route path={DAILY_PATH} element={<DailyPage />} />
      <Route path="/stories" element={<StoriesPage />} />
      <Route path="/spot-it/:slug" element={<SpotItPlay />} />
      <Route path="/spot-it" element={<SpotItPage />} />
      <Route path="/play/:code" element={<PlayTogether />} />
      <Route path="/play" element={<PlayTogether />} />
      <Route path="/story/:slug" element={<StoryStrip />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/puzzle/custom/:customId" element={<Puzzle />} />
      <Route path="/puzzle/:imageId" element={<Puzzle />} />
    </Routes>
  );
}

export default App;
