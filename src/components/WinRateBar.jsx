import React from 'react';
import { Box, Typography } from '@mui/material';

export default function WinRateBar({ wins, losses }) {
  const total = wins + losses;
  const winRate = total === 0 ? 0 : Math.round((wins / total) * 100);
  const loseRate = 100 - winRate;

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* 승/패 막대 */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: 24,
          borderRadius: 0.5,
          overflow: 'hidden',
          backgroundColor: '#2F2F3A',
        }}
      >
        <Box
          sx={{
            width: `${winRate}%`,
            backgroundColor: '#678EFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            px: 1,
            minWidth: 30, // 너무 작으면 텍스트 깨지는 거 방지 (선택)
          }}
        >
          <Typography
            fontSize={11}
            fontWeight="bold"
            color="white"
            lineHeight={1}
            whiteSpace="nowrap" // ✅ 한 줄 고정
          >
            {wins}승
          </Typography>
        </Box>
        <Box
          sx={{
            width: `${loseRate}%`,
            backgroundColor: '#E65A5A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 1,
            minWidth: 30, // ✅ 작을 경우 텍스트 겹침 방지
          }}
        >
          <Typography
            fontSize={11}
            fontWeight="bold"
            color="white"
            lineHeight={1}
            whiteSpace="nowrap" // ✅ 줄바꿈 없이 표시
          >
            {losses}패
          </Typography>
        </Box>
      </Box>

      {/* 승률 퍼센트 */}
      <Typography fontSize={11} fontWeight="bold" color="#4BE3AC">
        {winRate}%
      </Typography>
    </Box>
  );
}
