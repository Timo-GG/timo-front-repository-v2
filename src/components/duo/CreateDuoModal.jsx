// src/components/duo/CreateDuoModal.jsx
import React, { useState } from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    TextField,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PositionFilterBar from './PositionFilterBar';
import { createDuoBoard } from '../../apis/redisAPI';
import useAuthStore from '../../storage/useAuthStore';

export default function CreateDuoModal({ open, onClose }) {
    const [
        formData, setFormData] = useState({
        myPosition: 'nothing',
        playStyle: '즐겜',
        gameStatus: '첫판',
        mic: 'off',
        duoPosition: 'nothing',
        duoPlayStyle: '즐겜',
        queueType: '랭크',
        memo: '',
    });

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const { userData } = useAuthStore();
    const riot = userData?.riotAccount;
    const memberId = userData?.memberId;

    const handleSubmit = async () => {
        if (!riot || !memberId) {
            alert('로그인 또는 라이엇 계정 연동이 필요합니다.');
            return;
        }

        const dto = {
            memo: formData.memo,
            duoMapCode:
                formData.queueType === '랭크'
                    ? 'RANK'
                    : formData.queueType === '일반'
                        ? 'NORMAL'
                        : 'HOWLING_ABYSS',
            requestUserDto: {
                memberId,
                riotAccount: {
                    accountName: riot.accountName,
                    accountTag: riot.accountTag,
                },
                userInfo: {
                    myPosition: formData.myPosition.toUpperCase(),
                    myStyle: formData.playStyle === '빡겜' ? 'HARD' : 'FUN',
                    myStatus:
                        formData.gameStatus === '첫판'
                            ? 'FIRST'
                            : formData.gameStatus === '계속 플레이'
                                ? 'CONTINUE'
                                : 'LAST',
                    myVoice: formData.mic === 'on' ? 'ENABLED' : 'DISABLED',
                },
                duoInfo: {
                    opponentPosition: formData.duoPosition.toUpperCase(),
                    opponentStyle: formData.duoPlayStyle === '빡겜' ? 'HARD' : 'FUN',
                },
            },
        };

        console.log(dto);

        try {
            await createDuoBoard(dto);
            alert('듀오 게시글이 등록되었습니다.');
            onClose();
        } catch (err) {
            console.error('등록 실패:', err);
            alert('등록에 실패했습니다.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <Box>
                <Box sx={{ backgroundColor: '#31313D', p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontSize="1.1rem" fontWeight="bold" color="#fff">
                            듀오 등록하기
                        </Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon sx={{ color: '#fff' }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ height: '1px', backgroundColor: '#171717' }} />

                <Box sx={{ backgroundColor: '#31313E', p: 3 }}>
                    <Box display="flex" justifyContent="center" gap={3} mb={3}>
                        {/* 내 정보 영역 */}
                        <Box sx={{ width: 280, p: 2, borderRadius: 1, backgroundColor: '#31313E' }}>
                            <Typography fontSize="1rem" fontWeight="bold" color="#fff" mb={2}>
                                내 정보
                            </Typography>

                            {/* 포지션 */}
                            <Box mb={2}>
                                <Typography mb={0.5} color="#aaa" fontSize="0.8rem">포지션</Typography>
                                <PositionFilterBar
                                    positionFilter={formData.myPosition}
                                    onPositionClick={(val) => updateField('myPosition', val)}
                                    selectedColor="#42E6B5"
                                    unselectedColor="#424254"
                                    hoverColor="#42E6B5"
                                    iconSize={26}
                                    iconInvert
                                />
                            </Box>

                            {/* 플레이 스타일 */}
                            <Box mb={2}>
                                <Typography mb={0.5} color="#aaa" fontSize="0.8rem">플레이 스타일</Typography>
                                <Box display="flex" gap={1} p={0.5} bgcolor="#424254" borderRadius={1}>
                                    {['즐겜', '빡겜'].map((style) => (
                                        <Box
                                            key={style}
                                            onClick={() => updateField('playStyle', style)}
                                            sx={{
                                                flex: 1,
                                                textAlign: 'center',
                                                py: 1,
                                                cursor: 'pointer',
                                                borderRadius: 1,
                                                fontSize: '0.85rem',
                                                color: formData.playStyle === style ? '#fff' : '#888',
                                                fontWeight: formData.playStyle === style ? 'bold' : 'normal',
                                                backgroundColor: formData.playStyle === style ? '#42E6B5' : 'transparent',
                                            }}
                                        >
                                            {style}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* 내 상태 */}
                            <Box mb={2}>
                                <Typography mb={0.5} color="#aaa" fontSize="0.8rem">내 상태</Typography>
                                <Box display="flex" gap={1} p={0.5} bgcolor="#424254" borderRadius={1}>
                                    {['첫판', '계속 플레이', '마지막판'].map((status) => (
                                        <Box
                                            key={status}
                                            onClick={() => updateField('gameStatus', status)}
                                            sx={{
                                                flex: 1,
                                                textAlign: 'center',
                                                py: 1,
                                                cursor: 'pointer',
                                                borderRadius: 1,
                                                fontSize: '0.85rem',
                                                color: formData.gameStatus === status ? '#fff' : '#888',
                                                fontWeight: formData.gameStatus === status ? 'bold' : 'normal',
                                                backgroundColor: formData.gameStatus === status ? '#42E6B5' : 'transparent',
                                            }}
                                        >
                                            {status}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* 마이크 */}
                            <Box mb={1}>
                                <Typography mb={0.5} color="#aaa" fontSize="0.8rem">마이크</Typography>
                                <Box display="flex" gap={1} p={0.5} bgcolor="#424254" borderRadius={1}>
                                    {['on', 'off'].map((m) => (
                                        <Box
                                            key={m}
                                            onClick={() => updateField('mic', m)}
                                            sx={{
                                                flex: 1,
                                                textAlign: 'center',
                                                py: 1,
                                                cursor: 'pointer',
                                                borderRadius: 1,
                                                fontSize: '0.85rem',
                                                color: formData.mic === m ? '#fff' : '#888',
                                                fontWeight: formData.mic === m ? 'bold' : 'normal',
                                                backgroundColor: formData.mic === m ? '#42E6B5' : 'transparent',
                                            }}
                                        >
                                            {m === 'on' ? '사용' : '사용 안 함'}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>

                        {/* 듀오 정보 영역 */}
                        <Box sx={{ width: 280, p: 2, borderRadius: 1, backgroundColor: '#31313E' }}>
                            <Typography fontSize="1rem" fontWeight="bold" color="#fff" mb={2}>듀오 정보</Typography>

                            {/* 찾는 포지션 */}
                            <Box mb={2}>
                                <Typography mb={0.5} color="#aaa" fontSize="0.8rem">선호 포지션</Typography>
                                <PositionFilterBar
                                    positionFilter={formData.duoPosition}
                                    onPositionClick={(val) => updateField('duoPosition', val)}
                                    selectedColor="#42E6B5"
                                    unselectedColor="#424254"
                                    hoverColor="#42E6B5"
                                    iconSize={26}
                                    iconInvert
                                />
                            </Box>

                            {/* 듀오 스타일 */}
                            <Box mb={2}>
                                <Typography mb={0.5} color="#aaa" fontSize="0.8rem">선호 플레이 스타일</Typography>
                                <Box display="flex" gap={1} p={0.5} bgcolor="#424254" borderRadius={1}>
                                    {['즐겜', '빡겜'].map((style) => (
                                        <Box
                                            key={style}
                                            onClick={() => updateField('duoPlayStyle', style)}
                                            sx={{
                                                flex: 1,
                                                textAlign: 'center',
                                                py: 1,
                                                cursor: 'pointer',
                                                borderRadius: 1,
                                                fontSize: '0.85rem',
                                                color: formData.duoPlayStyle === style ? '#fff' : '#888',
                                                fontWeight: formData.duoPlayStyle === style ? 'bold' : 'normal',
                                                backgroundColor: formData.duoPlayStyle === style ? '#42E6B5' : 'transparent',
                                            }}
                                        >
                                            {style}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* 큐 타입 */}
                            <Box mb={2}>
                                <Typography mb={0.5} color="#aaa" fontSize="0.8rem">큐 타입</Typography>
                                <Box display="inline-flex" alignItems="center" sx={{
                                    border: '1px solid #424254',
                                    borderRadius: 1,
                                    p: 0.5,
                                    justifyContent: 'center',
                                }}>
                                    <Select
                                        value={formData.queueType}
                                        onChange={(e) => updateField('queueType', e.target.value)}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'transparent',
                                            color: '#fff',
                                            borderRadius: 1,
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                            '& .MuiSelect-icon': { color: '#7B7B8E' },
                                            '& .MuiSelect-select': {
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                p: 1,
                                            },
                                        }}
                                    >
                                        <MenuItem value="랭크" sx={{ fontSize: '0.85rem' }}>랭크</MenuItem>
                                        <MenuItem value="일반" sx={{ fontSize: '0.85rem' }}>일반</MenuItem>
                                        <MenuItem value="칼바람" sx={{ fontSize: '0.85rem' }}>칼바람</MenuItem>
                                    </Select>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* 메모 작성 */}
                    <Box mb={3}>
                        <Typography mb={0.5} color="#aaa" fontSize="0.8rem">메모</Typography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={4}
                            placeholder="간단한 소개나 원하는 조건을 적어주세요."
                            value={formData.memo}
                            onChange={(e) => updateField('memo', e.target.value)}
                            sx={{
                                backgroundColor: '#424254',
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
                    <Box display="flex" gap={2}>
                        <Button
                            fullWidth
                            onClick={onClose}
                            sx={{
                                backgroundColor: '#2A2B31',
                                color: '#fff',
                                fontWeight: 'bold',
                                height: 42,
                                fontSize: '1rem',
                                borderRadius: 1,
                            }}
                        >
                            취소
                        </Button>
                        <Button
                            fullWidth
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: '#42E6B5',
                                color: '#000',
                                fontWeight: 'bold',
                                height: 42,
                                fontSize: '1rem',
                                borderRadius: 1,
                            }}
                        >
                            <Typography fontWeight="bold" color="#fff">등록</Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}