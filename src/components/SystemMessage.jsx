// src/components/SystemMessage.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SystemMessage({message }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1}}>
      <Box
        sx={{
          backgroundColor: '#31313C',
          border: '1px solid #3b3c4f',
          borderRadius: 3,
          px: 2,
          py: 0.5,
        }}
      >
        <Typography fontSize={12} color="#9AA4AF" textAlign="center">
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
