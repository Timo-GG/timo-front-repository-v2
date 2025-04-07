import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ChatMessage({ type, text, timestamp, showTime }) {
  return (
    <Box display="flex" justifyContent={type === 'sent' ? 'flex-end' : 'flex-start'} mb={1}>
      <Box>
        <Box
          sx={{
            backgroundColor: type === 'sent' ? '#fff' : '#3b3c4f',
            color: type === 'sent' ? '#000' : '#fff',
            px: 2,
            py: 1,
            borderRadius: 1,

          }}
        >
          {text}
        </Box>
        {showTime && (
          <Typography
            fontSize={10}
            color="#777"
            mt={0.3}
            textAlign={type === 'sent' ? 'right' : 'left'}
            sx={{ ml: type === 'sent' ? 0 : 1, mr: type === 'sent' ? 1 : 0 }}
          >
            {timestamp?.slice(11, 16)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}