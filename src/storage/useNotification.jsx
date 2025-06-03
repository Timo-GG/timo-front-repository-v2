import { create } from 'zustand';

const useNotificationStore = create((set) => ({
    notifications: [],
    addNotification: (notification) =>

        set((state) => ({

            notifications: [
                ...state.notifications,
                {
                    id: notification.id || '',  // 서버 id 우선, 없으면 로컬 id
                    message: notification.message,
                    redirectUrl: notification.redirectUrl || '',
                    time: notification.regDate ? new Date(notification.regDate) : new Date()
                },
            ],
        })),
    clearNotifications: () => set({ notifications: [] }),
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
}));

export default useNotificationStore;