import { useEffect } from 'react';
import socket from '../socket/socket';
import useNotificationStore from '../storage/useNotification';

export default function NotificationListener() {
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('✅ 소켓 연결됨');
        });

        socket.on('newNotification', (noti) => {
            console.log('📩 알림 도착:', noti);
            addNotification(noti);
        });

        return () => {
            socket.off('newNotification');
            socket.disconnect();
        };
    }, []);

    return null;
}
