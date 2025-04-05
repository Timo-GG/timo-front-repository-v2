// src/components/ChampionIconList.jsx
import React from 'react';
import { Box, Avatar } from '@mui/material';
import { getChampionImageUrl } from '../utils/championUtils';

export default function ChampionIconList({ championNames = [] }) {
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
