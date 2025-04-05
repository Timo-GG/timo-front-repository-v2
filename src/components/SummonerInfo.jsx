// src/components/SummonerInfo.jsx
import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

export default function SummonerInfo({ name, tag, avatarUrl }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar src={avatarUrl} alt={name} sx={{ width: 32, height: 32 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography fontSize="0.95rem" lineHeight={1.2} noWrap sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </Typography>
        <Typography fontSize="0.8rem" color="#B7B7C9" lineHeight={1.2}>
          #{tag}
        </Typography>
      </Box>
    </Box>
  );
}
