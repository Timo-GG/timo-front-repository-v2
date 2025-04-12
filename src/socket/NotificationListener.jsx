import { useEffect } from 'react';
import { getSocket } from '../socket/socket';
import useNotificationStore from '../storage/useNotification';

export default function NotificationListener() {
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        const socket = getSocket();

        if (!socket) {
            console.warn('❗ 소켓이 아직 연결되지 않았습니다.');
            return;
        }

        socket.on('connect', () => {
            console.log('✅ 소켓 연결됨');
        });

        socket.on('newNotification', (noti) => {
            console.log('📩 알림 도착:', noti);
            addNotification(noti);
        });

        return () => {
            socket.off('newNotification');
            socket.off('connect');
        };
    }, []);

    return null;
}
