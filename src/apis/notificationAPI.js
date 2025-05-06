import axiosInstance from './axiosInstance';

// 안 읽은 알림 가져오기
export const fetchUnreadNotifications = async () => {
    const res = await axiosInstance.get('/notifications/unread', {
        withAuth: true,
    });
    return res.data; // List<NotificationResponse>
};

// 특정 알림 읽음 처리
export const markNotificationAsRead = async (notificationId) => {
    const res = await axiosInstance.post(`/notifications/${notificationId}/read`, null, {
        withAuth: true,
    });
    return res.data;
};

// 알림 전송 (프론트에서 관리자용 or 테스트용으로 쓸 때)
export const sendNotification = async (notificationRequest) => {
    const res = await axiosInstance.post('/notifications/send', notificationRequest, {
        withAuth: true,
    });
    return res.data;
};