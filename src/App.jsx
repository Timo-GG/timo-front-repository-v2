import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
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
import {connectSocket, getSocket} from './socket/socket';
import useOnlineStore from './storage/useOnlineStore';
import {getMyInfo} from './apis/authAPI';

function App() {
    const {accessToken, userData, setUserData, logout} = useAuthStore();
    const {setOnlineCount} = useOnlineStore();

    useEffect(() => {
        if (accessToken && !userData) {
            getMyInfo()
                .then((res) => {
                    setUserData(res.data);
                })
                .catch((err) => {
                    console.error('getMyInfo 실패', err);
                    logout();
                });
        }
    }, [accessToken, userData]);

    useEffect(() => {
        // accessToken이 있더라도 항상 소켓 연결을 한 번만 수행
        const socket = connectSocket(accessToken);

        // online_count 이벤트 리스너 등록
        socket.on('online_count', (data) => {
            console.log('[App] online_count 수신:', data);
            if (data && typeof data.count === 'number') {
                setOnlineCount(data.count);
            }
        });

        // 로그인 유저라면 join_online 이벤트 발생
        if (accessToken && userData?.memberId) {
            socket.emit('join_online', { memberId: userData.memberId });
        }

        return () => {
            // 떠날 때 leave_online 이벤트 발생 후 소켓 disconnect
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
        return <MyPage defaultTab={defaultTab} initialRoomId={roomId}/>;
    }

    return (
        <Router>
            <Header/>
            <NotificationListener/>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/search" element={<SearchPage/>}/>
                <Route path="/mysetting" element={<MySettingPage/>}/>
                <Route path="/ranking" element={<RankingPage/>}/>
                <Route path="/mypage" element={<MyPage/>}/>
                <Route path="/duo" element={<DuoPage/>}/>
                <Route path="/scrim" element={<ScrimPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                <Route path="/profile-setup" element={<ProfileSetup/>}/>
                <Route path="/test" element={<TestPage/>}/>
                <Route path="/auth/callback/:provider" element={<AuthCallback/>}/>
                <Route path="/chat" element={<ChatRouteWrapper/>}/>
            </Routes>
        </Router>
    );
}

export default App;
