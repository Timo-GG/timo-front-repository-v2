// src/components/socket/TestSocketConnect.jsx
import { useEffect } from 'react';
import socket from '../socket/socket';

export default function TestSocketConnect() {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('✅ 소켓 연결 성공!');
        });

        socket.on('connect_error', (err) => {
            console.error('❌ 소켓 연결 실패:', err.message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <div style={{ color: 'white' }}>소켓 연결 테스트 중...</div>;
}
