import { create } from 'zustand';

const useOnlineStore = create((set) => ({
    onlineCount: 0,
    setOnlineCount: (count) => set({ onlineCount: count }),
}));

export default useOnlineStore;