// src/components/CreateDuoModal.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Modal,
    TextField,
    Button,
    Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/** ----- 헬퍼 함수 (아이콘 경로) ----- **/
// 포지션 6가지: top, jungle, mid, bottom, support, nothing
const getPositionImage = (position) => `/src/assets/position/${position}.png`;

// 마이크 on/off 아이콘 (예: mic_on.png, mic_off.png)
const getMicImage = (micState) => `/src/assets/mic/${micState}.png`;

/** ----- 선택지 목록 ----- **/
const positions = ['nothing', 'top', 'jungle', 'mid', 'bottom', 'support'];
const playStyles = ['즐겜', '빡겜'];
const lineStates = ['침착', '계속 플레이', '마지막판'];
const micOptions = ['on', 'off'];
const queueTypes = ['솔로랭크', '자유랭크', '일반'];

// 이미지 사이즈 상수 (모든 이미지 40×40)
const ICON_SIZE = 40;

export default function CreateDuoModal({ open, onClose }) {
    // --- 내 정보 (왼쪽) ---
    const [myPosition, setMyPosition] = useState('top');       // 포지션
    const [myPlayStyle, setMyPlayStyle] = useState('즐겜');    // 플레이스타일
    const [myLineState, setMyLineState] = useState('침착');    // 라인 상태
    const [myMic, setMyMic] = useState('off');                // 마이크 on/off

    // --- 듀오 정보 (오른쪽) ---
    const [duoPosition, setDuoPosition] = useState('mid');     // 포지션
    const [duoPlayStyle, setDuoPlayStyle] = useState('빡겜');  // 선호 플레이스타일
    const [duoQueue, setDuoQueue] = useState('솔로랭크');      // 큐 타입

    // 메모 (한 줄 소개 등)
    const [memo, setMemo] = useState('');

    // 모달 닫기
    const handleClose = () => {
        onClose();
    };

    // 등록 버튼
    const handleRegister = () => {
        // 실제로는 여기서 API 호출 혹은 상위 콜백 처리
        alert(`
[내 정보]
포지션: ${myPosition}
플레이스타일: ${myPlayStyle}
라인 상태: ${myLineState}
마이크: ${myMic}

[듀오 정보]
포지션: ${duoPosition}
선호 플레이스타일: ${duoPlayStyle}
큐 타입: ${duoQueue}

메모: ${memo}
    `);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            {/* 모달 배경 (가운데 정렬) */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    outline: 'none'
                }}
            >
                {/* 모달 컨테이너 */}
                <Box
                    sx={{
                        width: 700,
                        maxWidth: '90%',
                        backgroundColor: '#2c2c3a',
                        borderRadius: 2,
                        p: 3,
                        position: 'relative'
                    }}
                >
                    {/* 상단 헤더 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                            듀오 등록하기
                        </Typography>
                        <IconButton onClick={handleClose} sx={{ color: '#fff', ml: 'auto' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* 본문: 2개 컬럼 (내 정보 / 듀오 정보) */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* 내 정보 (왼쪽 컬럼) */}
                        <Box
                            sx={{
                                flex: 1,
                                backgroundColor: '#1e1f2d',
                                borderRadius: 2,
                                p: 2
                            }}
                        >
                            <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                내 정보
                            </Typography>

                            {/* 포지션 */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: '#999', fontSize: 14, mb: 1 }}>
                                    포지션
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {positions.map((pos) => (
                                        <Avatar
                                            key={pos}
                                            src={getPositionImage(pos)}
                                            variant="square"
                                            sx={{
                                                width: ICON_SIZE,
                                                height: ICON_SIZE,
                                                cursor: 'pointer',
                                                backgroundColor: myPosition === pos ? '#424254' : 'transparent',
                                                p: 1,
                                                borderRadius: 1,
                                                '&:hover': {
                                                    backgroundColor: '#424254'
                                                }
                                            }}
                                            onClick={() => setMyPosition(pos)}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* 플레이스타일 */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: '#999', fontSize: 14, mb: 1 }}>
                                    플레이스타일
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {playStyles.map((style) => (
                                        <Button
                                            key={style}
                                            variant="contained"
                                            sx={{
                                                fontSize: 14,
                                                backgroundColor: myPlayStyle === style ? '#424254' : '#2c2c3a',
                                                color: '#fff',
                                                borderRadius: 1,
                                                minWidth: 70,
                                                '&:hover': {
                                                    backgroundColor: '#424254'
                                                }
                                            }}
                                            onClick={() => setMyPlayStyle(style)}
                                        >
                                            {style}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>

                            {/* 라인 상태 */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: '#999', fontSize: 14, mb: 1 }}>
                                    라인 상태
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {lineStates.map((state) => (
                                        <Button
                                            key={state}
                                            variant="contained"
                                            sx={{
                                                fontSize: 14,
                                                backgroundColor: myLineState === state ? '#424254' : '#2c2c3a',
                                                color: '#fff',
                                                borderRadius: 1,
                                                '&:hover': {
                                                    backgroundColor: '#424254'
                                                }
                                            }}
                                            onClick={() => setMyLineState(state)}
                                        >
                                            {state}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>

                            {/* 마이크 */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: '#999', fontSize: 14, mb: 1 }}>
                                    마이크
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {micOptions.map((micVal) => (
                                        <Avatar
                                            key={micVal}
                                            src={getMicImage(micVal)}
                                            variant="square"
                                            sx={{
                                                width: ICON_SIZE,
                                                height: ICON_SIZE,
                                                cursor: 'pointer',
                                                backgroundColor: myMic === micVal ? '#424254' : 'transparent',
                                                p: 1,
                                                borderRadius: 1,
                                                '&:hover': {
                                                    backgroundColor: '#424254'
                                                }
                                            }}
                                            onClick={() => setMyMic(micVal)}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>

                        {/* 듀오 정보 (오른쪽 컬럼) */}
                        <Box
                            sx={{
                                flex: 1,
                                backgroundColor: '#1e1f2d',
                                borderRadius: 2,
                                p: 2
                            }}
                        >
                            <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                듀오 정보
                            </Typography>

                            {/* 포지션 */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: '#999', fontSize: 14, mb: 1 }}>
                                    포지션
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {positions.map((pos) => (
                                        <Avatar
                                            key={pos}
                                            src={getPositionImage(pos)}
                                            variant="square"
                                            sx={{
                                                width: ICON_SIZE,
                                                height: ICON_SIZE,
                                                cursor: 'pointer',
                                                backgroundColor: duoPosition === pos ? '#424254' : 'transparent',
                                                p: 1,
                                                borderRadius: 1,
                                                '&:hover': {
                                                    backgroundColor: '#424254'
                                                }
                                            }}
                                            onClick={() => setDuoPosition(pos)}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* 선호 플레이스타일 */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: '#999', fontSize: 14, mb: 1 }}>
                                    선호 플레이스타일
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {playStyles.map((style) => (
                                        <Button
                                            key={style}
                                            variant="contained"
                                            sx={{
                                                fontSize: 14,
                                                backgroundColor: duoPlayStyle === style ? '#424254' : '#2c2c3a',
                                                color: '#fff',
                                                borderRadius: 1,
                                                minWidth: 70,
                                                '&:hover': {
                                                    backgroundColor: '#424254'
                                                }
                                            }}
                                            onClick={() => setDuoPlayStyle(style)}
                                        >
                                            {style}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>

                            {/* 큐 타입 */}
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: '#999', fontSize: 14, mb: 1 }}>
                                    큐 타입
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {queueTypes.map((qt) => (
                                        <Button
                                            key={qt}
                                            variant="contained"
                                            sx={{
                                                fontSize: 14,
                                                backgroundColor: duoQueue === qt ? '#424254' : '#2c2c3a',
                                                color: '#fff',
                                                borderRadius: 1,
                                                '&:hover': {
                                                    backgroundColor: '#424254'
                                                }
                                            }}
                                            onClick={() => setDuoQueue(qt)}
                                        >
                                            {qt}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* 메모 (아래쪽, 전체 너비) */}
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ color: '#999', fontSize: 14, mb: 1 }}>
                            메모
                        </Typography>
                        <TextField
                            placeholder="짧은 한 줄 소개를 입력해주세요."
                            variant="outlined"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            sx={{
                                width: '100%',
                                backgroundColor: '#1e1f2d',
                                borderRadius: 1,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#424254'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#42E6B5'
                                },
                                '& .MuiInputBase-input': {
                                    color: '#fff',
                                    fontSize: 14
                                }
                            }}
                            inputProps={{ maxLength: 50 }}
                        />
                    </Box>

                    {/* 하단 버튼 (취소 / 등록) */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                width: 80,
                                backgroundColor: '#424254',
                                color: '#fff',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#56566c'
                                }
                            }}
                            onClick={handleClose}
                        >
                            취소
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                width: 80,
                                backgroundColor: '#42E6B5',
                                color: '#000',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#36c9a1'
                                }
                            }}
                            onClick={handleRegister}
                        >
                            등록
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
