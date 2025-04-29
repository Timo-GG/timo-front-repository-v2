/** 티어 이미지 표시 */

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

export default function TierBadge({ tier = 'unrank', score, rank }) {
    const validTiers = Object.keys(TIER_DISPLAY_NAME);
    const isValidTier = validTiers.includes(tier);
    const iconUrl = getTierIcon(isValidTier ? tier : 'unrank');
    const displayTier = TIER_DISPLAY_NAME[tier];

    const isMasterPlus = ['master', 'grandmaster', 'challenger'].includes(tier);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
            <img
                src={iconUrl}
                alt={tier}
                style={{
                    width: 32,
                    height: 32,
                    objectFit: 'contain',
                    display: 'block',
                }}
            />
            {isValidTier && tier !== 'unrank' && (
                <Typography fontSize="0.85rem" fontWeight="bold">
                    {isMasterPlus
                        ? `${displayTier} ${score}`
                        : `${displayTier} ${rank}`} {/* 다이아 이하: 로마 숫자 표시 */}
                </Typography>
            )}
        </Box>
    );
}
