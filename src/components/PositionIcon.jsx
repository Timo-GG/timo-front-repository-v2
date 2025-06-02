// src/components/PositionIcon.jsx
import React from 'react';
import { Box } from '@mui/material';
import top from '../../public/assets/position/top.png';
import jungle from '../../public/assets/position/jungle.png';
import mid from '../../public/assets/position/mid.png';
import bottom from '../../public/assets/position/bottom.png';
import support from '../../public/assets/position/support.png';
import nothing from '../../public/assets/position/nothing.png';

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
        style={{ width: 26, height: 26 }}
      />
    </Box>
  );
}
