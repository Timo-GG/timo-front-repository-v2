import React, { useEffect } from 'react';
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
import useOnlineStore from './storage/useOnlineStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
    const { accessToken, userData, initializeAuth } = useAuthStore();
    const { setOnlineCount } = useOnlineStore();
    const queryClient = new QueryClient();

    // ✅ 앱 시작 시 토큰 복원
    useEffect(() => {
        const restored = initializeAuth();
        console.log("토큰 복원 결과:", restored);
    }, []);

    useEffect(() => {
        const socket = connectSocket(accessToken);

        socket.on('online_count', (data) => {
            console.log('[App] online_count 수신:', data);
            if (data && typeof data.count === 'number') {
                setOnlineCount(data.count);
            }
        });

        if (accessToken && userData?.memberId) {
            socket.emit('join_online', { memberId: userData.memberId });
        }

        return () => {
            if (accessToken && userData?.memberId) {
                socket.emit('leave_online', { memberId: userData.memberId });
            }
            socket.disconnect();
        };
    }, [accessToken, userData?.memberId, setOnlineCount]);

    function ChatRouteWrapper() {
        const location = useLocation();
        const searchParams = new URLSearchParams(location.search);
        const roomId = parseInt(searchParams.get('roomId'), 10);
        const defaultTab = searchParams.get('tab') === 'chat' ? 2 : 0;
        return <MyPage defaultTab={defaultTab} initialRoomId={roomId} />;
    }

    return (
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
    );
}

export default App;
