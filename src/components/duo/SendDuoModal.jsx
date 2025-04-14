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
import PositionIcon from '../PositionIcon';

/**
 * 듀오 신청 모달
 *
 * @param {boolean} open - 모달 열림 여부
 * @param {function} handleClose - 닫기 버튼 이벤트
 * @param {object} userData - 신청 대상 소환사(또는 내 정보)
 *   {
 *     name, tag, school, avatarUrl, ...
 *   }
 */
export default function SendDuoModal({ open, handleClose, userData = {} }) {
    // 포지션 선택
    const [position, setPosition] = useState('top');
    // 플레이스타일 (즐겜/빡겜)
    const [playStyle, setPlayStyle] = useState('즐겜');
    // 내 상태 (첫판/계속 플레이/마지막판)
    const [gameStatus, setGameStatus] = useState('첫판');
    // 마이크 여부
    const [mic, setMic] = useState('off');
    // 메모
    const [memo, setMemo] = useState('');

    const handleSubmit = () => {
        // 실제로 듀오 신청 로직을 처리한 뒤 모달 닫기
        // 예: API 호출 등을 수행
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm">
            <Box sx={{ backgroundColor: '#31313D', p: 3 }}>
                {/* 헤더 영역 */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* 소환사 정보 (상단 왼쪽) */}
                    <SummonerInfo
                        name={userData.name || '소환사명'}
                        // 예: "#{userData.tag} | {userData.school}"
                        tag={`${userData.tag || '0000'} | ${userData.school || '학교명'}`}
                        avatarUrl={userData.avatarUrl || '/assets/default.png'}
                    />
                    {/* 닫기 버튼 (상단 오른쪽) */}
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Box>

                {/* 구분선 */}
                <Box sx={{ my: 2, height: '1px', backgroundColor: '#171717' }} />

                {/* 본문 타이틀 */}
                <Typography mb={1} color="#fff" fontSize="1rem">
                    내정보
                </Typography>

                {/* 포지션 */}
                <Box mb={2}>
                    <Typography mb={0.5} color="#aaa" sx={{ fontSize: '0.8rem' }}>
                        포지션
                    </Typography>
                    <PositionFilterBar
                        positionFilter={position}
                        onPositionClick={setPosition}
                        selectedColor="#42E6B5"
                        unselectedColor="#31313D"
                        hoverColor="#42E6B5"
                        iconSize={26}
                        iconInvert={true}
                    />
                </Box>

                {/* 플레이스타일 (즐겜/빡겜) */}
                <Box mb={2}>
                    <Typography mb={0.5} color="#aaa" sx={{ fontSize: '0.8rem' }}>
                        플레이스타일
                    </Typography>
                    <Box
                        display="flex"
                        gap={1}
                        p={0.5}
                        bgcolor="#424254"
                        borderRadius={1}
                    >
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

                {/* 내 상태 (첫판/계속 플레이/마지막판) */}
                <Box mb={2}>
                    <Typography mb={0.5} color="#aaa" sx={{ fontSize: '0.8rem' }}>
                        내 상태
                    </Typography>
                    <Box
                        display="flex"
                        gap={1}
                        p={0.5}
                        bgcolor="#424254"
                        borderRadius={1}
                    >
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
                    <Typography mb={0.5} color="#aaa" sx={{ fontSize: '0.8rem' }}>
                        마이크
                    </Typography>
                    <Box
                        display="flex"
                        gap={1}
                        p={0.5}
                        bgcolor="#424254"
                        borderRadius={1}
                    >
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
                    <Typography mb={0.5} color="#aaa" sx={{ fontSize: '0.8rem' }}>
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
                                '& fieldset': {
                                    border: 'none',
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '0.85rem',
                                color: '#fff',
                            },
                        }}
                    />
                </Box>

                {/* 듀오 신청 버튼 */}
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
