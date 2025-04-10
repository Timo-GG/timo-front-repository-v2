// src/pages/TestPage.jsx
import React, { useEffect } from 'react';
import { authAPI } from '../apis';
import TestSocketConnect from '../socket/TestSocketConnect';

export default function TestPage() {
    useEffect(() => {
        const test = async () => {
            try {
                const data = await authAPI.testToken({
                    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9....',
                    refreshToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9....',
                });
                console.log('✅ 성공:', data);
            } catch (err) {
                console.error('❌ 에러:', err.response?.data || err.message);
            }
        };

        test();
    }, []);

    return (
        <div style={{ color: 'white' }}>
            <h2>소켓 연결 테스트</h2>
            <TestSocketConnect />
        </div>
    );
}
