// src/socket/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (accessToken) => {
    console.log('🚀 connectSocket() 호출됨, accessToken:', accessToken);

    if (socket) {
        socket.disconnect();
        socket = null;
    }

    const query = accessToken
        ? { token: accessToken }
        : { guest: 'true' };

    socket = io('ws://localhost:8085', {
        transports: ['websocket'],
        query,
    });

    // ✅ 연결 이벤트 리스너 추가
    socket.on('connect', () => {
        console.log('✅ Socket 연결 성공! ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Socket 연결 해제:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Socket 연결 오류:', error);
    });

    return socket;
};

export const getSocket = () => socket;

// ✅ disconnectSocket 함수 추가
export const disconnectSocket = () => {
    if (socket) {
        console.log('🔌 소켓 연결 해제 중...');
        socket.disconnect();
        socket = null;
    }
};

export const listenOnlineCount = (callback) => {
    if (!socket) return;

    socket.on('online_count', (data) => {
        console.log('[listenOnlineCount] 수신 데이터:', data);
        if (data && typeof data.count === 'number') {
            callback(data.count);
        }
    });
};
