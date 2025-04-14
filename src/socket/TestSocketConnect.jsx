import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../socket/socket';

export default function TestSocketConnect({ accessToken }) {
    useEffect(() => {
        const socket = connectSocket(accessToken);

        if (!socket) return;

        socket.on('connect', () => {
            console.log('✅ 소켓 연결 성공!');
        });

        socket.on('connect_error', (err) => {
            console.error('❌ 소켓 연결 실패:', err.message);
        });

        return () => {
            disconnectSocket();
        };
    }, [accessToken]);

    return <div style={{ color: 'white' }}>소켓 연결 테스트 중...</div>;
}