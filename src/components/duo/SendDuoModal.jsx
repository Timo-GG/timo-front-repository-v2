// src/components/duo/SendDuoModal.jsx
import React, { useState } from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import SummonerInfo from '../SummonerInfo';
import PositionFilterBar from './PositionFilterBar';
import { sendDuoRequest } from '../../apis/redisAPI';
import useAuthStore from '../../storage/useAuthStore';

export default function SendDuoModal({ open, handleClose, boardUUID, userData = {} }) {
    const [position, setPosition] = useState('nothing');
    const [playStyle, setPlayStyle] = useState('즐겜');
    const [gameStatus, setGameStatus] = useState('첫판');
    const [mic, setMic] = useState('off');
    const [memo, setMemo] = useState('');

    const { userData: me } = useAuthStore();
    const riot = me?.riotAccount;
    const memberId = me?.memberId;

    const handleSubmit = async () => {
        if (!riot || !memberId) {
            alert('로그인 또는 라이엇 계정 연동이 필요합니다.');
            return;
        }

        const dto = {
            boardUUID,        // 직접 props로 받은 값
            requestorId: memberId,
            userInfo: {
                myPosition: position.toUpperCase(),
                myStyle: playStyle === '빡겜' ? 'HARD' : 'FUN',
                myStatus:
                    gameStatus === '첫판'
                        ? 'FIRST'
                        : gameStatus === '계속 플레이'
                            ? 'CONTINUE'
                            : 'LAST',
                myVoice: mic === 'on' ? 'ENABLED' : 'DISABLED',
            },
            requestorMemo: memo,
        };

        try {
            await sendDuoRequest(dto);
            alert('듀오 신청이 전송되었습니다.');
            handleClose();
        } catch (err) {
            console.error('신청 실패:', err);
            alert('신청에 실패했습니다.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm">
            <Box sx={{ backgroundColor: '#31313D', p: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <SummonerInfo
                        name={userData.name || '소환사명'}
                        tag={`${userData.tag || '0000'} | ${userData.school || '학교명'}`}
                        avatarUrl={userData.avatarUrl || '/assets/default.png'}
                    />
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Box>

                <Box sx={{ my: 2, height: '1px', backgroundColor: '#171717' }} />

                <Typography mb={1} color="#fff" fontSize="1rem">
                    내정보
                </Typography>

                {/* 포지션 */}
                <Box mb={2}>
                    <Typography mb={0.5} color="#aaa" fontSize="0.8rem">
                        포지션
                    </Typography>
                    <PositionFilterBar
                        positionFilter={position}
                        onPositionClick={setPosition}
                        selectedColor="#42E6B5"
                        unselectedColor="#31313D"
                        hoverColor="#42E6B5"
                        iconSize={26}
                        iconInvert
                    />
                </Box>

                {/* 플레이스타일 */}
                <Box mb={2}>
                    <Typography mb={0.5} color="#aaa" fontSize="0.8rem">
                        플레이스타일
                    </Typography>
                    <Box display="flex" gap={1} p={0.5} bgcolor="#424254" borderRadius={1}>
                        {['즐겜', '빡겜'].map((style) => (
                            <Box
                                key={style}
                                onClick={() => setPlayStyle(style)}
                                sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    py: 1,
                                    cursor: 'pointer',
                                    borderRadius: 1,
                                    fontSize: '0.85rem',
                                    color: playStyle === style ? '#fff' : '#888',
                                    fontWeight: playStyle === style ? 'bold' : 'normal',
                                    backgroundColor: playStyle === style ? '#42E6B5' : 'transparent',
                                }}
                            >
                                {style}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* 내 상태 */}
                <Box mb={2}>
                    <Typography mb={0.5} color="#aaa" fontSize="0.8rem">
                        내 상태
                    </Typography>
                    <Box display="flex" gap={1} p={0.5} bgcolor="#424254" borderRadius={1}>
                        {['첫판', '계속 플레이', '마지막판'].map((status) => (
                            <Box
                                key={status}
                                onClick={() => setGameStatus(status)}
                                sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    py: 1,
                                    cursor: 'pointer',
                                    borderRadius: 1,
                                    fontSize: '0.85rem',
                                    color: gameStatus === status ? '#fff' : '#888',
                                    fontWeight: gameStatus === status ? 'bold' : 'normal',
                                    backgroundColor: gameStatus === status ? '#42E6B5' : 'transparent',
                                }}
                            >
                                {status}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* 마이크 */}
                <Box mb={2}>
                    <Typography mb={0.5} color="#aaa" fontSize="0.8rem">
                        마이크
                    </Typography>
                    <Box display="flex" gap={1} p={0.5} bgcolor="#424254" borderRadius={1}>
                        {['on', 'off'].map((m) => (
                            <Box
                                key={m}
                                onClick={() => setMic(m)}
                                sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    py: 1,
                                    cursor: 'pointer',
                                    borderRadius: 1,
                                    fontSize: '0.85rem',
                                    color: mic === m ? '#fff' : '#888',
                                    fontWeight: mic === m ? 'bold' : 'normal',
                                    backgroundColor: mic === m ? '#42E6B5' : 'transparent',
                                }}
                            >
                                {m === 'on' ? '사용' : '사용안함'}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* 메모 */}
                <Box mb={3}>
                    <Typography mb={0.5} color="#aaa" fontSize="0.8rem">
                        메모
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        rows={4}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="내용을 입력해주세요."
                        multiline
                        sx={{
                            bgcolor: '#424254',
                            color: '#fff',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '0.85rem',
                                color: '#fff',
                            },
                        }}
                    />
                </Box>

                {/* 버튼 */}
                <Box display="flex" gap={1.5}>
                    <Button
                        fullWidth
                        size="small"
                        onClick={handleClose}
                        sx={{
                            bgcolor: '#2A2B31',
                            color: '#fff',
                            fontWeight: 'bold',
                            height: 42,
                            fontSize: '1rem',
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        fullWidth
                        size="small"
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: '#42E6B5',
                            color: '#fff',
                            fontWeight: 'bold',
                            height: 42,
                            fontSize: '1rem',
                        }}
                    >
                        듀오 신청
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
