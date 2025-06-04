/** 모스트 챔피언 3개 표시 */

import React from 'react';
import { Box, Avatar } from '@mui/material';
import { getChampionImageUrl } from '../../utils/championUtils';

export default function ChampionIconList({ championNames = [] }) {

  // 추가 안전장치
  if (!championNames || !Array.isArray(championNames)) {
    console.warn('championNames is not a valid array:', championNames);
    return null; // 또는 빈 Box 반환
  }

  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        {championNames.map((name, index) => (
            <Avatar
                key={index}
                src={getChampionImageUrl(name)}
                alt={name}
                sx={{ width: 32, height: 32 }}
            />
        ))}
      </Box>
  );
}