/** 한줄 소개 용량 초과 표시 */

import React from 'react';
import { Box } from '@mui/material';

export default function TruncatedMessageBox({ message, maxWidth = 180 }) {
  return (
    <Box
      sx={{
        backgroundColor: '#424254',
        p: 1,
        borderRadius: 1,
        color: '#fff',
        fontSize: '0.85rem',
        maxWidth,
        lineHeight: 1.4,
        textAlign: 'left',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordWrap: 'break-word',
        wordBreak: 'break-all',
        whiteSpace: 'normal',
        maxHeight: '3.6em',
      }}
    >
      {message}
    </Box>
  );
}
