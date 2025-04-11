// src/components/ConfirmRequiredDialog.jsx
import React from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ConfirmRequiredDialog({ open, onClose }) {
  const navigate = useNavigate();

  const handleMoveToMyPage = () => {
    onClose();
    navigate('/mysetting');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 3 }}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem', p: 0, mb: 1 }}>
          인증이 필요합니다.
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Typography>
            <strong>학교 이메일</strong>과 <strong>소환사 인증</strong>이 필요합니다.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            내 계정 페이지에서 인증을 완료해주세요.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ mt: 3, p: 0, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ fontWeight: 'bold' }}>닫기</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMoveToMyPage}
            sx={{ fontWeight: 'bold' }}
          >
            내 계정으로 가기
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}