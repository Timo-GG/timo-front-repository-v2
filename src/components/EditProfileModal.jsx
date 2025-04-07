import React, { useState } from 'react';
import {
    Dialog, Button, Typography, Box, TextField, Select, MenuItem, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SummonerInfo from '../components/SummonerInfo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PositionFilterBar from '../components/PositionFilterBar';
import PositionIcon from '../components/PositionIcon';

const POSITION_LIST = ['nothing', 'top', 'jungle', 'mid', 'bottom', 'support'];

export default function EditProfileModal({ open, handleClose }) {
    const [position, setPosition] = useState('top');
    const [department, setDepartment] = useState('컴퓨터공학과');
    const [selectedGender, setSelectedGender] = useState('비밀');
    const [selectedMbti, setSelectedMbti] = useState(['E', 'S', 'T', 'P']);
    const [memo, setMemo] = useState('');

    const toggleMbti = (type) => {
        const groupMap = {
            E: ['E', 'I'],
            I: ['E', 'I'],
            N: ['N', 'S'],
            S: ['N', 'S'],
            F: ['F', 'T'],
            T: ['F', 'T'],
            P: ['P', 'J'],
            J: ['P', 'J'],
        };
        const group = groupMap[type];
        const updated = selectedMbti.filter((t) => !group.includes(t));
        setSelectedMbti([...updated, type]);
    };

    const handleSubmit = () => {
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box sx={{ backgroundColor: '#31313D', p: 2, }}>
                {/* 헤더 */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <SummonerInfo
                        name="롤10년차고인물"
                        tag="1234"
                        avatarUrl="/assets/default.png"
                    />
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Box>

                <Box sx={{ my: 2, height: '1px', backgroundColor: '#171717' }} />

                <Typography mb={1} color="#fff" fontSize="1rem">내 정보</Typography>

                <Box display="flex" gap={3}>
                    {/* 왼쪽 영역 */}
                    <Box flex={1}>
                        <Typography mb={0.5} color="#aaa" sx={{
                            fontSize: '0.8rem',
                        }}>주 포지션</Typography>
                        <Box display="flex" gap={1} mb={2}>
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

                        <Typography mb={0.5} color="#aaa" sx={{
                            fontSize: '0.8rem',
                        }}>학과</Typography>
                        <Select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                                mb: 2,
                                backgroundColor: '#2A2B31',
                                color: '#fff',
                                fontSize: '0.8rem',
                                '& .MuiSelect-icon': {
                                    color: '#7B7B8E',
                                },
                            }}
                        >
                            <MenuItem value="컴퓨터공학과" sx={{
                                fontSize: '0.8rem',
                            }}>컴퓨터공학과</MenuItem>
                            <MenuItem value="전자공학과" sx={{
                                fontSize: '0.8rem',
                            }}>전자공학과</MenuItem>
                            <MenuItem value="기계공학과" sx={{
                                fontSize: '0.8rem',
                            }}>기계공학과</MenuItem>
                        </Select>

                        <Typography mb={0.5} color="#aaa" sx={{
                            fontSize: '0.8rem',
                        }}>성별</Typography>
                        <Box display="flex" justifyContent="space-between" p={0.5} borderRadius={1} bgcolor="#424254" mb={2}>
                            {['남자', '여자', '비밀'].map((g) => (
                                <Box
                                    key={g}
                                    onClick={() => setSelectedGender(g)}
                                    sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        py: 1,
                                        cursor: 'pointer',
                                        borderRadius: 1,
                                        fontSize: '0.85rem',
                                        color: selectedGender === g ? '#fff' : '#888',
                                        fontWeight: selectedGender === g ? 'bold' : 'normal',
                                        backgroundColor: selectedGender === g ? '#42E6B5' : 'transparent',
                                    }}
                                >
                                    {g}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* 오른쪽 영역 (MBTI) */}
                    <Box flex={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography color="#aaa" fontSize="0.8rem">MBTI</Typography>
                            <Box display="flex" alignItems="center">
                                <Typography color="#aaa" fontSize="0.8rem">초기화</Typography>
                                <IconButton size="small" onClick={() => setSelectedMbti([])}>
                                    <RestartAltIcon sx={{ color: '#7B7B8E', fontSize: 18 }} />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* MBTI 설명 위 */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(4, 1fr)"
                            gap={0.5}
                            fontSize="0.7rem"
                            color="#888"
                            textAlign="center"
                            mb={0.5}
                        >
                            {['외향', '직관', '감성', '탐색'].map((label, i) => (
                                <Typography key={i} sx={{
                                    fontSize: '0.7rem',
                                    color: '#888',
                                    lineHeight: 1.2,
                                }}>{label}</Typography>
                            ))}
                        </Box>

                        {/* MBTI 버튼 */}
                        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" rowGap={1} mb={0.5}>
                            {['E', 'N', 'F', 'P', 'I', 'S', 'T', 'J'].map((type) => (
                                <Button
                                    key={type}
                                    onClick={() => toggleMbti(type)}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        bgcolor: selectedMbti.includes(type) ? '#42E6B5' : '#2A2B31',
                                        color: selectedMbti.includes(type) ? '#fff' : '#B7B7C9',
                                        borderRadius: 0.5,
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        mx: 'auto',
                                        minWidth: 0,
                                        p: 0,
                                    }}
                                >
                                    {type}
                                </Button>
                            ))}
                        </Box>

                        {/* MBTI 설명 아래 */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(4, 1fr)"
                            gap={0.5}
                            fontSize="0.7rem"
                            color="#888"
                            textAlign="center"
                        >
                            {['내향', '현실', '이성', '계획'].map((label, i) => (
                                <Typography key={i}
                                    sx={{
                                        fontSize: '0.7rem',
                                        color: '#888',
                                        lineHeight: 1.2,
                                    }}>{label}</Typography>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* 메모 */}
                <Typography mt={2} mb={0.5} color="#aaa" sx={{
                    fontSize: '0.8rem',
                }}>메모</Typography>
                <TextField
                    fullWidth
                    size="small"
                    rows={1}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    sx={{
                        bgcolor: '#424254',
                        color: '#fff',
                        borderRadius: 1,
                        input: { color: '#fff' },
                        fontSize: '0.8rem',
                    }}
                />

                {/* 버튼 */}
                <Box display="flex" gap={1.5} mt={3}>
                    <Button fullWidth onClick={handleClose} size="small" sx={{
                        bgcolor: '#2A2B31', color: '#fff', fontWeight: 'bold',
                        height: 42,
                        fontSize: '1rem',
                    }}>
                        취소
                    </Button>
                    <Button fullWidth onClick={handleSubmit} size="small" sx={{
                        bgcolor: '#42E6B5', color: '#fff', fontWeight: 'bold',
                        height: 42,
                        fontSize: '1rem',
                    }}>
                        등록
                    </Button>
                </Box>
            </Box>
        </Dialog >
    );
}
