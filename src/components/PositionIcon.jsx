// src/components/PositionIcon.jsx
import React from 'react';
import { Box } from '@mui/material';
import top from '../assets/position/top.png';
import jungle from '../assets/position/jungle.png';
import mid from '../assets/position/mid.png';
import bottom from '../assets/position/bottom.png';
import support from '../assets/position/support.png';
import nothing from '../assets/position/nothing.png';

const positionIcons = {
    top,
    jungle,
    mid,
    bottom,
    support,
    none: nothing,
  };

export default function PositionIcon({ position = 'none' }) {
  const iconSrc = positionIcons[position] || positionIcons['none'];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <img
        src={iconSrc}
        alt={position}
        style={{ width: 36, height: 36 }}
      />
    </Box>
  );
}
