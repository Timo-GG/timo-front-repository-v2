import { create } from 'zustand';

// useChatStore.jsx
const useChatStore = create((set) => ({
    chatList: [],
    currentRoomId: null,

    setChatList: (newList) => set({ chatList: newList }),
    
    updateMessages: (roomId, newMessages) =>
        set((state) => ({
            chatList: state.chatList.map((room) =>
                room.id === roomId
                    ? { ...room, messages: newMessages }
                    : room
            ),
        })),

    addMessage: (roomId, message) =>
        set((state) => {
            const chatList = state.chatList ?? [];
            const exists = chatList.find((chat) => chat.id === roomId);
            if (!exists) {
                return {
                    chatList: [
                        ...chatList,
                        {
                            id: roomId,
                            messages: [message],
                        },
                    ],
                };
            }

            return {
                chatList: chatList.map((chat) =>
                    chat.id === roomId
                        ? { ...chat, messages: [...(chat.messages ?? []), message] }
                        : chat
                ),
            };
        }),
}));


export default useChatStore;