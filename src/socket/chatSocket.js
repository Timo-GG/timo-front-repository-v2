// src/socket/chatSocket.js
import { getSocket } from './socket';
import useChatStore from '../storage/useChatStore';

export const initializeChatSocket = () => {
    const socket = getSocket();
    if (!socket) return;

    // 1. 메시지 수신
    socket.on('receive_message', (data) => {
        console.log('[💬 메시지 도착]', data);
        const { roomId, payload: message } = data;
        useChatStore.getState().addMessage(roomId, message);
    });

    // 2. 시스템 알림: 퇴장 등
    socket.on('leave', (data) => {
        console.log('[❌ 퇴장 이벤트]', data);
        // 원하는 처리를 여기서
    });
};

export const sendMessage = ({ roomId, content }) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('send_message', { roomId, content });
};

export const sendReadReceipt = ({ roomId, messageId }) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('read_message', { roomId, messageId });
};

export const leaveChatRoom = ({ roomId }) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('leave_room', { roomId });
};
