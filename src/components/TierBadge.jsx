// components/TierBadge.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { getTierIcon } from '../utils/tierUtils';

const TIER_DISPLAY_NAME = {
  iron: 'I',
  bronze: 'B',
  silver: 'S',
  gold: 'G',
  platinum: 'P',
  emerald: 'E',
  diamond: 'D',
  master: 'M',
  grandmaster: 'GM',
  challenger: 'C',
  unrank: 'UR',
};

export default function TierBadge({ tier = 'unrank', score }) {
  const iconUrl = getTierIcon(tier);
  const displayTier = TIER_DISPLAY_NAME[tier] || '언랭크';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
      <img src={iconUrl} alt={tier} style={{ width: 32, height: 32 }} />
      <Typography fontSize="0.85rem" fontWeight="bold">
        {['master', 'grandmaster', 'challenger'].includes(tier)
          ? `${displayTier} ${score}`
          : `${displayTier}${score}`}
      </Typography>
    </Box>
  );
}
