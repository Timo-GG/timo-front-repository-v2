// src/pages/TestPage.jsx
import React from 'react';
import useAuthStore from '../storage/useAuthStore';
import TestSocketConnect from '../socket/TestSocketConnect';

export default function TestPage() {
    const { accessToken } = useAuthStore(); // ✅ 로그인된 유저의 accessToken 가져옴

    return (
        <div style={{ color: 'white' }}>
            <h2>소켓 연결 테스트</h2>
            <TestSocketConnect accessToken={accessToken} />
        </div>
    );
}
