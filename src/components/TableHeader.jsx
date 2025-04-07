// components/MyRequestHeader.jsx
import React from 'react';
import { Box } from '@mui/material';

export default function TableHeader() {
    const columns = [1.5, 1, 1.5, 1.5, 2, 0.5, 1, 1.5];
    const headers = ['소환사', '티어', '승률(최근 10게임)', '모스트 챔피언', '한 줄 소개', '분류', '등록 일시', '듀오 신청'];

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            fontSize: 14,
            fontWeight: 500,
            color: '#999',
            backgroundColor: '#28282F',
        }}>
            {headers.map((text, i) => (
                <Box key={i} sx={{ flex: columns[i], textAlign: 'center' }}>{text}</Box>
            ))}
        </Box>
    );
}