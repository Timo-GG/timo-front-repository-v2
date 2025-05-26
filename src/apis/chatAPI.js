// src/apis/chatAPI.js
import axiosInstance from './axiosInstance';

// 채팅방 목록 조회
export const fetchChatRooms = async () => {
    const res = await axiosInstance.get('/chat/rooms', {
        withAuth: true,
    });
    return res.data; // APIDataResponse<List<ChatRoomResponse>>
};

// 채팅방 메시지 조회 (페이징)
export const fetchChatMessages = async (roomId, page = 0) => {
    const res = await axiosInstance.get(`/chat/rooms/${roomId}/messages?page=${page}`, {
        withAuth: true,
    });
    return res.data; // List<ChatMessageDTO>
};

// 채팅방 안 읽은 메시지 수 조회
export const fetchUnreadCount = async (roomId) => {
    const res = await axiosInstance.get(`/chat/rooms/${roomId}/unread`, {
        withAuth: true,
    });
    return res.data; // APIDataResponse<Integer>
};

// 채팅방 나가기
export const leaveChatRoom = async (roomId) => {
    const res = await axiosInstance.post(`/chat/rooms/${roomId}/leave`, {}, {
        withAuth: true,
    });
    return res.data; // APIDataResponse<Void>
};

