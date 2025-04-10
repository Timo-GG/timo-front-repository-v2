import { create } from 'zustand';

const useNotificationStore = create((set) => ({
    notifications: [],
    addNotification: (noti) =>
        set((state) => ({
            notifications: [noti, ...state.notifications],
        })),
    clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
