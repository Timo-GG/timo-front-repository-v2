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
import ProfileSetup from './pages/ProfileSetupPage';
import TestPage from './pages/TestPage';
import NotificationListener from './socket/NotificationListener';
import AuthCallback from './pages/AuthCallback';
import useAuthStore from './storage/useAuthStore';
import { connectSocket } from './socket/socket';
import ChatPage from './pages/ChatPage';
import useOnlineStore from './storage/useOnlineStore';
import NotificationPermissionButton from './components/NotificationPermissionButton';
function App() {
  const { accessToken, userData } = useAuthStore();
  const handleAllow = () => {
    console.log('알림 허용된 이후 추가 동작 실행');
  };
  useEffect(() => {
    const socket = connectSocket(accessToken); // ✅ token 없어도 guest 연결됨
    // 로그인 유저일 경우에만 join_online


    if (accessToken && userData?.memberId) {

      socket.emit('join_online', { memberId: userData.memberId });
    }

    return () => {
      // 로그인 유저면 leave_online 전송
      if (accessToken && userData?.memberId) {
        socket.emit('leave_online', { memberId: userData.memberId });
      }
      socket.disconnect();
    };
  }, [accessToken, userData?.memberId]);

  const { setOnlineCount } = useOnlineStore();

  useEffect(() => {
    const socket = connectSocket(accessToken);

    // ✅ online_count 리스너 등록
    socket.on('online_count', (data) => {
      console.log('[App] online_count 수신:', data);
      if (data && typeof data.count === 'number') {
        setOnlineCount(data.count);
      }
    });

    // 로그인 유저일 경우 join_online
    if (accessToken && userData?.memberId) {
      socket.emit('join_online', { memberId: userData.memberId });
    }

    return () => {
      if (accessToken && userData?.memberId) {
        socket.emit('leave_online', { memberId: userData.memberId });
      }
      socket.disconnect();
    };
  }, [accessToken, userData?.memberId]);
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