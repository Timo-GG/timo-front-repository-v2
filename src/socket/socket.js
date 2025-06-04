// src/socket/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (accessToken) => {
    console.log('🚀 connectSocket() 호출됨, accessToken:', !!accessToken);

    // 기존 소켓이 있으면 정리
    if (socket) {
        console.log('🔄 기존 소켓 정리 중...');
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }


    const baseUrl = import.meta.env.VITE_SOCKET_BASE_URL;

    const query = accessToken
        ? { token: accessToken }
        : { guest: 'true' };

    socket = io(`${baseUrl}`, {
        transports: ['websocket'],
        query,
        forceNew: true, // 새로운 연결 강제
    });

    // 기본 이벤트 리스너들
    socket.on('connect', () => {
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

export const disconnectSocket = () => {
    if (socket) {
        console.log('🔌 소켓 연결 해제 중...');
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
};

export const isSocketConnected = () => {
    return socket && socket.connected;
};
