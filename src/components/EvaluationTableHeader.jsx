import React from 'react';
import { Box } from '@mui/material';

export default function EvaluationTableHeader() {
    const columns = [1.5, 1, 1, 1.5, 1.5, 1, 1.5, 1]; // 각 컬럼 flex 비율
    const headers = ['소환사', '포지션', '맵', '대학교', '학과', '분류', '등록 일시', '평가 상태'];

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
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