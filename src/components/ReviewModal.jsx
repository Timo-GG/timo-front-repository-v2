// ReviewModal.jsx
import React, { useState } from 'react';
import {
    Dialog,
    IconButton,
    Box,
    Typography,
    Avatar,
    TextField,
    Button,
    Rating,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 질문별 선택지
const ATTITUDE_OPTIONS = ['성실하게 임해요', '노력해요', '집중하지 않아요'];
const MANNER_OPTIONS = ['매너있는 소환사', '평범한 소환사', '공격적인 소환사'];
const SKILL_OPTIONS = ['한 수 배우고 갑니다', '무난한 플레이', '고의 트롤을 해요'];

export default function ReviewModal({ open, handleClose, user }) {
    const [attitude, setAttitude] = useState('');
    const [manner, setManner] = useState('');
    const [skill, setSkill] = useState('');
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        console.log('[리뷰 등록]', {
            name: user?.name,
            tag: user?.tag,
            attitude,
            manner,
            skill,
            score,
            comment,
        });
        handleClose();
    };

    if (!user) return null;

    // 공용 함수: 질문마다 3개 선택 박스 렌더링
    const renderThreeChoices = (options, selectedValue, setValue) => (
        <Box
            display="flex"
            justifyContent="center" // 가운데 정렬
            gap={1}                // 선택지 간 간격
            p={0.5}
            borderRadius={1}
            bgcolor="#424254"
            mt={1}
            width="100%"
        >
            {options.map((opt) => (
                <Box
                    key={opt}
                    onClick={() => setValue(opt)}
                    sx={{
                        flex: 1,
                        textAlign: 'center',
                        py: 1,
                        cursor: 'pointer',
                        borderRadius: 1,
                        fontSize: '0.8rem',
                        color: selectedValue === opt ? '#fff' : '#888',
                        fontWeight: selectedValue === opt ? 'bold' : 'normal',
                        backgroundColor: selectedValue === opt ? '#42E6B5' : 'transparent',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                            backgroundColor:
                                selectedValue === opt ? '#42E6B5' : 'rgba(255,255,255,0.05)',
                        },
                    }}
                >
                    {opt}
                </Box>
            ))}
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={false}
            PaperProps={{
                sx: {
                    width: '900px',
                    maxWidth: '95vw',
                    backgroundColor: '#31313D',
                    borderRadius: 2,
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                {/* 헤더: 아바타 + 닉네임/태그 + 닫기 버튼 */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={user.avatarUrl} sx={{ width: 48, height: 48 }} />
                        <Box>
                            {/* 첫 줄: 이름 */}
                            <Typography variant="h6" sx={{ color: '#fff', fontSize: '1rem' }}>
                                {user.name}
                            </Typography>
                            {/* 둘째 줄: 태그 | 학교 */}
                            <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.85rem' }}>
                                #{user.tag} | {user.school}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Box>

                {/* 가로 구분선 */}
                <Box sx={{ mb: 2, height: '1px', backgroundColor: '#171717' }} />

                {/* 좌우 패널: 고정 높이 제거 */}
                <Box display="flex" gap={3} alignItems="stretch" mt={3} mb={3}>
                    {/* 왼쪽 패널 */}
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            // 전체 배경 추가 시:
                            // backgroundColor: '#2B2C3C',
                            // borderRadius: 1,
                        }}
                    >
                        <Typography color="#fff" textAlign="center" sx={{ fontSize: '1rem' }}>
                            소환사의 태도는 어떤가요?
                        </Typography>
                        {renderThreeChoices(ATTITUDE_OPTIONS, attitude, setAttitude)}

                        <Typography color="#fff" textAlign="center" sx={{ fontSize: '1rem', mt: 3 }}>
                            소환사의 말투는 어떤가요?
                        </Typography>
                        {renderThreeChoices(MANNER_OPTIONS, manner, setManner)}

                        <Typography color="#fff" textAlign="center" sx={{ fontSize: '1rem', mt: 3 }}>
                            소환사의 실력은 어떤가요?
                        </Typography>
                        {renderThreeChoices(SKILL_OPTIONS, skill, setSkill)}
                    </Box>

                    {/* 오른쪽 패널 */}
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    // backgroundColor: '#2B2C3C' 등을 원하시면 추가
                    >
                        <Typography color="#fff" textAlign="center" sx={{ fontSize: '1rem' }}>
                            소환사의 매너 점수를 남겨주세요
                        </Typography>
                        <Rating
                            value={score}
                            onChange={(_, newValue) => setScore(newValue || 0)}
                            max={5}
                            sx={{
                                mt: 1,
                                // 별 크기 크게
                                '& .MuiRating-icon': {
                                    fontSize: '5rem',
                                },
                            }}
                        />

                        <TextField
                            multiline
                            rows={2}
                            placeholder="간단한 후기를 남겨주세요.."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{
                                width: '100%',
                                backgroundColor: '#424254',
                                borderRadius: 1,
                                fontSize: '0.9rem',
                                mt: 2,
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#56566A',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#84849C',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#42E6B5',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#fff',
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: '#42E6B5',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                                px: 3,
                                py: 1,
                                '&:hover': {
                                    backgroundColor: '#32d3a2',
                                },
                            }}
                        >
                            평점 남기기
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}
