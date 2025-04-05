import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, TextField, Select, MenuItem, Avatar, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SummonerInfo from '../components/SummonerInfo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const POSITION_LIST = ['nothing', 'top', 'jungle', 'mid', 'bottom', 'support'];

export default function EditProfileModal({ open, handleClose }) {
    const [position, setPosition] = useState('top');
    const [department, setDepartment] = useState('컴퓨터공학과');
    const [selectedGender, setSelectedGender] = useState('비밀');
    const [selectedMbti, setSelectedMbti] = useState(['E', 'S', 'T', 'P']);
    const [memo, setMemo] = useState('');

    const MBTI_GROUPS = [
        { pair: ['E', 'I'], labels: ['외향', '내향'] },
        { pair: ['N', 'S'], labels: ['직관', '현실'] },
        { pair: ['F', 'T'], labels: ['감성', '이성'] },
        { pair: ['P', 'J'], labels: ['탐색', '계획'] },
    ];

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
        // TODO: 등록 로직
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <Box sx={{ backgroundColor: '#31313D', p: 3, pt: 3 }}>

                {/* 상단 Header */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    {/* ✅ SummonerInfo 컴포넌트 사용 */}
                    <SummonerInfo
                        name="롤10년차고인물"
                        tag="1234"
                        avatarUrl="/assets/default.png"
                    />

                    <IconButton onClick={handleClose} sx={{ p: 0.5 }}>
                        <CloseIcon sx={{ color: '#fff', fontSize: '1.8rem' }} />
                    </IconButton>
                </Box>
                <Box
                    mt={2}
                    mb={2}
                    sx={{
                        height: '1px',
                        backgroundColor: '#171717',
                        width: '100%',
                    }}
                />

                <Typography mb={1} color="#fff" fontSize="1.3rem">내 정보</Typography>

                {/* 폼 좌우 */}
                <Box display="flex" gap={5}>
                    {/* 왼쪽 영역 */}
                    <Box flex={1}>
                        {/* 주 포지션 */}
                        <Typography mb={1} color="#aaa">주 포지션</Typography>
                        <Box display="flex" gap={2} mb={4}>
                            {POSITION_LIST.map((pos) => {
                                const isSelected = position === pos;
                                return (
                                    <Box
                                        key={pos}
                                        onClick={() => setPosition(pos)}
                                        sx={{
                                            borderRadius: 1,
                                            p: 1,
                                            width: 48,
                                            height: 48,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            bgcolor: isSelected ? '#42E6B5' : '#31313D', // ✅ 선택 배경 / 비선택 배경
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <img
                                            src={`../src/assets/position/${pos}.png`}
                                            alt={pos}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                filter: isSelected ? 'brightness(0) invert(1)' : 'brightness(1)', // ✅ 아이콘 색 반전
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                        {/* 학과 */}
                        <Typography mb={1} color="#aaa">학과</Typography>
                        <Select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            fullWidth
                            sx={{
                                mb: 3,
                                backgroundColor: '#2A2B31',
                                color: '#fff',
                                '& .MuiSelect-icon': {
                                    color: '#7B7B8E', // 👈 드롭다운 화살표 색상
                                },
                            }}
                        >
                            <MenuItem value="컴퓨터공학과">컴퓨터공학과</MenuItem>
                            <MenuItem value="전자공학과">전자공학과</MenuItem>
                            <MenuItem value="기계공학과">기계공학과</MenuItem>
                        </Select>

                        {/* 성별 */}
                        <Typography mb={1} color="#aaa">성별</Typography>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={3}
                            p={1}
                            borderRadius={1}
                            bgcolor="#424254"
                        >
                            {['남자', '여자', '비밀'].map((g) => (
                                <Box
                                    key={g}
                                    onClick={() => setSelectedGender(g)}
                                    sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        py: 1.2,
                                        cursor: 'pointer',
                                        borderRadius: 1,
                                        transition: '0.2s',
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
                            <Typography color="#aaa">MBTI</Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography color="#aaa">초기화</Typography>
                                <IconButton size="small" onClick={() => setSelectedMbti([])}>
                                    <RestartAltIcon sx={{ color: '#7B7B8E', fontSize: 20 }} />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* 설명 텍스트 (위) */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(4, 1fr)"
                            gap={0.5}
                            fontSize="0.75rem"
                            color="#888"
                            textAlign="center"
                            mb={0.5}
                            mt={2}
                        >
                            {['외향', '직관', '감성', '탐색'].map((label, i) => (
                                <Typography key={i}>{label}</Typography>
                            ))}
                        </Box>

                        {/* MBTI 버튼 (2줄) */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(4, 1fr)"
                            rowGap={1}
                            mb={0.5}
                        >
                            {['E', 'N', 'F', 'P', 'I', 'S', 'T', 'J'].map((type) => (
                                <Button
                                    key={type}
                                    onClick={() => toggleMbti(type)}
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        minWidth: 52,
                                        minHeight: 52,
                                        bgcolor: selectedMbti.includes(type) ? '#42E6B5' : '#2A2B31',
                                        color: selectedMbti.includes(type) ? '#fff' : '#B7B7C9',
                                        borderRadius: 1,
                                        fontWeight: 'bold',
                                        fontSize: "1.5rem",
                                        mx: 'auto', // 가운데 정렬
                                    }}
                                >
                                    {type}
                                </Button>
                            ))}
                        </Box>

                        {/* 설명 텍스트 (아래) */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(4, 1fr)"
                            gap={0.5}
                            fontSize="0.75rem"
                            color="#888"
                            textAlign="center"
                        >
                            {['내향', '현실', '이성', '계획'].map((label, i) => (
                                <Typography key={i}>{label}</Typography>
                            ))}
                        </Box>
                    </Box>


                </Box>
                {/* 메모 */}
                <Typography mb={1} color="#aaa">메모</Typography>
                <TextField
                    fullWidth
                    rows={1}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    sx={{
                        bgcolor: '#424254',
                        color: '#fff',
                        borderRadius: 1,
                        input: { color: '#fff' },
                    }}
                />

                {/* 하단 버튼 */}
                <Box display="flex" gap={2} mt={4}>
                    <Button fullWidth onClick={handleClose} size="large" sx={{
                        bgcolor: '#2A2B31', color: '#fff', fontWeight: 'bold',
                        height: 56,
                        fontSize: '1.2rem',
                    }}>
                        취소
                    </Button>
                    <Button fullWidth onClick={handleSubmit} sx={{
                        bgcolor: '#42E6B5', color: '#fff', fontWeight: 'bold',
                        height: 56,
                        fontSize: '1.2rem',
                    }}>
                        등록
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
