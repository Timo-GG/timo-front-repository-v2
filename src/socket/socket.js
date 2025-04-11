// src/socket/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (accessToken) => {
    if (!accessToken) {
        console.warn('❗️ accessToken이 없습니다.');
        return null;
    }

    // 기존 소켓이 있으면 정리
    if (socket) {
        socket.disconnect();
        socket = null;
    }

    socket = io('ws://localhost:8085', {
        transports: ['websocket'],
        query: {
            token: accessToken,
        },
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
