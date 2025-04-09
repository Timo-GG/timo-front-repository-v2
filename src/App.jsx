import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import MySettingPage from './pages/MySettingPage';
import RankingPage from './pages/RankingPage';
import MyPage from './pages/MyPage';
import ScrimPage from './pages/ScrimPage';
import DuoPage from './pages/DuoPage';
import SignupPage from './pages/SignupPage';
import ProfileSetup from './pages/ProfileSetup';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/mysetting" element={<MySettingPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/duo" element={<DuoPage />} />
        <Route path="/scrim" element={<ScrimPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
      </Routes>
    </Router>
  );
}

export default App;