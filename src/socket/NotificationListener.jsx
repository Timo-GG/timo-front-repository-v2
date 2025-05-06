import { useEffect } from 'react';
import useAuthStore from '../storage/useAuthStore';
import useNotificationStore from '../storage/useNotification';

export default function NotificationListener() {
    const { accessToken } = useAuthStore();
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        if (!accessToken) {
            console.warn('❗ accessToken이 없습니다. SSE 연결 생략.');
            return;
        }

        const eventSource = new EventSource(`http://localhost:8080/api/v1/notifications/subscribe?token=${accessToken}`);

        eventSource.onopen = () => {
            console.log('✅ SSE 연결됨');
        };

        eventSource.onmessage = (event) => {
            console.log('📩 일반 메시지 수신:', event.data);
        };

        eventSource.addEventListener('DUO_ACCEPTED', (event) => {
            console.log('📩 듀오 수락 알림:', JSON.parse(event.data));
            addNotification(JSON.parse(event.data));
        });

        eventSource.addEventListener('RANKING_UPDATED', (event) => {
            console.log('📩 랭킹 업데이트 알림:', JSON.parse(event.data));
            addNotification(JSON.parse(event.data));
        });

        eventSource.addEventListener('RANKING_REGISTERED', (event) => {
            const data = JSON.parse(event.data);
            console.log('📩 랭킹 등록 알림:', data);

            addNotification({
                id: data.id,
                message: data.message,             // 서버에서 내려준 기본 메시지 그대로 사용
                redirectUrl: data.redirectUrl,
                time: new Date().toLocaleString(),
            });
        });


        eventSource.onerror = (err) => {
            console.error('❗ SSE 연결 오류:', err);
            eventSource.close();
        };

        return () => {
            console.log('❗ SSE 연결 해제');
            eventSource.close();
        };
    }, [accessToken]);

    return null;
}
