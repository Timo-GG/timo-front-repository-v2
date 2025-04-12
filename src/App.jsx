import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import TestPage from './pages/TestPage';
import NotificationListener from './socket/NotificationListener';
import AuthCallback from './pages/AuthCallback';
import useAuthStore from './storage/useAuthStore';
import { connectSocket } from './socket/socket';
import ChatPage from './pages/ChatPage';
import { getMyInfo } from './apis/authAPI';
function App() {
  const { accessToken, userData, setUserData } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken);
    }
  }, [accessToken]); // ✅ accessToken이 바뀌었을 때만 다시 연결

  useEffect(() => {
    if (accessToken && !userData?.memberId) {
      getMyInfo()
        .then((res) => {
          console.log('[App] 사용자 정보 불러오기 성공', res);
          console.log('userData:', res.data);
          setUserData(res.data); // ✅ data 안에 실제 user 정보가 있는지 확인
        })
        .catch((err) => {
          console.error('[App] 사용자 정보 불러오기 실패', err);
        });
    }
  }, [accessToken, userData?.memberId]); // ✅ 의존성 변경

  function ChatRouteWrapper() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const roomId = parseInt(searchParams.get('roomId'), 10);
    // tab=chat이면 기본 탭을 2(채팅 탭)로 지정
    const defaultTab = searchParams.get('tab') === 'chat' ? 2 : 0;
    return <MyPage defaultTab={defaultTab} initialRoomId={roomId} />;
  }

  return (
    <Router>
      <Header />
      <NotificationListener />

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
        <Route path="/test" element={<TestPage />} />
        <Route path="/auth/callback/:provider" element={<AuthCallback />} />
        <Route path="/chat" element={<ChatRouteWrapper />} />

      </Routes>
    </Router>
  );
}

export default App;