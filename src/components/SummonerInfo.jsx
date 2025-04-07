// src/components/SummonerInfo.jsx
import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function SummonerInfo({ name, tag, avatarUrl, copyable = false }) {
  const handleCopy = () => {
    const fullTag = `${name}#${tag}`;
    navigator.clipboard.writeText(fullTag)
      .then(() => console.log('복사됨:', fullTag))
      .catch((err) => console.error('복사 실패:', err));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar src={avatarUrl} alt={name} sx={{ width: 32, height: 32 }} />
      <Box sx={{ lineHeight: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography
          fontSize="0.95rem"
          noWrap
          sx={{
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography fontSize="0.8rem" color="#B7B7C9" sx={{ lineHeight: 1.2 }}>
            #{tag}
          </Typography>
          {copyable && (
            <Tooltip title="복사" arrow>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{ p: 0.3, color: '#888', display: 'flex', alignItems: 'center' }}
              >
                <ContentCopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
}
