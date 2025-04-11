// src/components/WithdrawConfirmDialog.jsx
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

export default function WithdrawConfirmDialog({ open, onClose, onConfirm }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <Box sx={{ p: 3 }}>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem', p: 0, mb: 1 }}>
                    회원 탈퇴
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <Typography>
                        정말로 <strong>회원 탈퇴</strong>를 진행하시겠습니까?
                        <br />
                        탈퇴 시 모든 정보가 삭제됩니다.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ mt: 3, p: 0, justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} sx={{ fontWeight: 'bold' }}>취소</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onConfirm}
                        sx={{ fontWeight: 'bold' }}
                    >
                        탈퇴하기
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}