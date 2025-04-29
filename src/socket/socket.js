// src/socket/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (accessToken) => {
    console.log('🚀 connectSocket()', accessToken);
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    const query = accessToken
        ? { token: accessToken }      // 로그인 유저
        : { guest: 'true' };          // 게스트

    socket = io('ws://localhost:8085', {
        transports: ['websocket'],
        query,
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
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
