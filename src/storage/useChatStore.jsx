import { create } from 'zustand';

// useChatStore.jsx
const useChatStore = create((set) => ({
    chatList: [],
    currentRoomId: null,

    setChatList: (newList) => set({ chatList: newList }),

    updateMessages: (roomId, newMessages, prepend = false) =>
        set((state) => {
            const targetRoom = state.chatList.find(room => room.id === roomId);
            if (!targetRoom) return state;
            const updatedMessages = prepend
                ? [...newMessages, ...targetRoom.messages]
                : [...targetRoom.messages, ...newMessages];
            return {
                chatList: state.chatList.map(room =>
                    room.id === roomId ? { ...room, messages: updatedMessages } : room
                )
            };
        }),


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