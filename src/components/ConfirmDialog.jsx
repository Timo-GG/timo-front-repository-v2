// src/components/ConfirmDialog.jsx
import React from 'react';
import { Dialog, Box, Typography, Button } from '@mui/material';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = '확인',
  message = '정말로 진행하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
  danger = false,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 3 }}>
        <Typography fontWeight="bold" fontSize="1.1rem">{title}</Typography>
        <Typography sx={{ mt: 1 }}>{message}</Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button
            variant="contained"
            color={danger ? 'error' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
