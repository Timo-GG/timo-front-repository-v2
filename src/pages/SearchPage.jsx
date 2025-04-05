import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SearchPage() {
  return (
    <Box
      sx={{
        backgroundColor: '#12121a',
        minHeight: '100vh',
        pt: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" sx={{ color: '#fff' }}>
        전적 검색 페이지입니다.
      </Typography>
    </Box>
  );
}
