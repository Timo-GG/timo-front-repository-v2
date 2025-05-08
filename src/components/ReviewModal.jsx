import React, { useState, useEffect } from 'react';
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

const ATTITUDE_OPTIONS = ['성실하게 임해요', '노력해요', '집중하지 않아요'];
const MANNER_OPTIONS = ['매너있는 소환사', '평범한 소환사', '공격적인 소환사'];
const SKILL_OPTIONS = ['한 수 배우고 갑니다', '무난한 플레이', '고의 트롤을 해요'];

export default function ReviewModal({ open, handleClose, user }) {
    const [attitude, setAttitude] = useState('');
    const [manner, setManner] = useState('');
    const [skill, setSkill] = useState('');
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (user) {
            setAttitude(user.attitude || '');
            setManner(user.manner || '');
            setSkill(user.skill || '');
            setScore(user.score || 0);
            setComment(user.comment || '');
        }
    }, [user]);

    const isReadOnly = user?.reviewStatus === 'completed';

    if (!user) return null;

    const handleSubmit = () => {
        console.log('[리뷰 등록]', {
            name: user.name,
            tag: user.tag,
            attitude,
            manner,
            skill,
            score,
            comment,
        });
        handleClose();
    };

    const renderThreeChoices = (options, selectedValue, setValue) => (
        <Box
            display="flex"
            justifyContent="center"
            gap={1}
            p={0.5}
            borderRadius={1}
            bgcolor="#424254"
            mt={1}
            width="100%"
        >
            {options.map((opt) => (
                <Box
                    key={opt}
                    onClick={() => !isReadOnly && setValue(opt)}
                    sx={{
                        flex: 1,
                        textAlign: 'center',
                        py: 1,
                        cursor: isReadOnly ? 'default' : 'pointer',
                        borderRadius: 1,
                        fontSize: '0.8rem',
                        color: selectedValue === opt ? '#fff' : '#888',
                        fontWeight: selectedValue === opt ? 'bold' : 'normal',
                        backgroundColor: selectedValue === opt ? '#42E6B5' : 'transparent',
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={user.avatarUrl || ''} sx={{ width: 48, height: 48 }} />
                        <Box>
                            <Typography variant="h6" sx={{ color: '#fff', fontSize: '1rem' }}>
                                {user.name || ''}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.85rem' }}>
                                #{user.tag || ''} | {user.school || ''}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Box>

                <Box sx={{ mb: 2, height: '1px', backgroundColor: '#171717' }} />

                <Box display="flex" gap={3} alignItems="stretch" mt={3} mb={3}>
                    <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
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

                    <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Typography color="#fff" textAlign="center" sx={{ fontSize: '1rem' }}>
                            소환사의 매너 점수를 남겨주세요
                        </Typography>
                        <Rating
                            value={score}
                            onChange={(_, newValue) => !isReadOnly && setScore(newValue || 0)}
                            max={5}
                            readOnly={isReadOnly}
                            sx={{
                                mt: 1,
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
                            onChange={(e) => !isReadOnly && setComment(e.target.value)}
                            InputProps={{ readOnly: isReadOnly }}
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

                        {!isReadOnly && (
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
                        )}
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}
