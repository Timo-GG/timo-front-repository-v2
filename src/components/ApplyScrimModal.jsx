import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    Box, Typography, TextField, Select, MenuItem,
    Button, IconButton, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SummonerInfo from './SummonerInfo';
import TierBadge from './TierBadge';
import PositionFilterBar from './PositionFilterBar';
import ChampionIconList from './ChampionIconList';
import theme from '../theme';

const POSITION_LIST = ['top', 'jungle', 'mid', 'bottom', 'support'];
const defaultMember = {
    name: '',
    tag: '',
    tier: null,
    score: null,
    champions: [],
    position: null,
};
const dummyPartyMembers = [
    {
        name: '롤10년차고인물',
        tag: '1234',
        tier: 'emerald',
        score: 1,
        champions: ['Neeko', 'Kaisa', 'Ezreal'],
        position: 'top'
    },
    {
        name: '롤10년차고인물',
        tag: '1234',
        tier: 'emerald',
        score: 1,
        champions: ['Neeko', 'Kaisa', 'Ezreal'],
        position: 'jungle'
    },
    {},
    {}
];

export default function ApplyScrimModal({ open, handleClose }) {
    const [memo, setMemo] = useState('');
    const [map, setMap] = useState('소환사 협곡');
    const [people, setPeople] = useState('5:5');
    const [department, setDepartment] = useState('');
    const [myPosition, setMyPosition] = useState('nothing');
    const [partyMembers, setPartyMembers] = useState(dummyPartyMembers);
    const [errors, setErrors] = useState({});
    const [summonerName, setSummonerName] = useState('');

    const handleMemberPositionChange = (index, newPosition) => {
        const updated = [...partyMembers];
        updated[index] = {
            ...updated[index],
            position: newPosition,
        };
        setPartyMembers(updated);
    };
    const handleRemoveMember = (index) => {
        const updated = [...partyMembers];
        updated[index] = defaultMember;
        setPartyMembers(updated);
    };

    const handleVerifySummoner = (index) => {
        const updated = [...partyMembers];
        const summoner = updated[index];

        if (!summoner.name || !summoner.tag || summoner.name === '' || summoner.tag === '') {
            setErrors(prev => ({ ...prev, [index]: '존재하지 않는 소환사입니다.' }));
        } else {
            setErrors(prev => ({ ...prev, [index]: '' }));
        }
    };

    const partyLimit = people === '3:3' ? 2 : 4;
    const members = partyMembers.slice(0, partyLimit);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <Box sx={{ backgroundColor: '#31313E', pl: 3, pr: 3, pt: 2, pb: 1 }}>
                {/* 헤더 */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize="1.1rem" fontWeight="bold" color="#fff">내전 신청하기</Typography>
                    <IconButton onClick={handleClose}><CloseIcon sx={{ color: '#aaa' }} /></IconButton>
                </Box>
            </Box>
            <Box sx={{ height: '1px', backgroundColor: '#171717' }} />

            <Box sx={{ backgroundColor: '#31313E', pl: 3, pr: 3, pb: 1 }}>
                {/* 메모 */}
                <TextField
                    placeholder="저희랑 내전하실 분 구해요."
                    fullWidth
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    variant="outlined"
                    sx={{
                        my: 2,
                        borderRadius: 1,
                        bgcolor: '#282830',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: 'transparent',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'transparent',
                            }
                        },
                        input: {
                            color: '#fff',
                        }
                    }}
                />

                {/* 설정 */}
                <Box display="flex" gap={2} alignItems="flex-end" mb={2}>
                    <Box display="flex" flexDirection="column" justifyContent="flex-end">
                        <Typography fontSize="0.85rem" color="#aaa" mb={0.5}>
                            나의 포지션
                        </Typography>
                        <PositionFilterBar
                            positionFilter={myPosition}
                            onPositionClick={setMyPosition}
                            selectedColor="#42E6B5"
                            unselectedColor="#31313E"
                            iconSize={24}

                        />
                    </Box>


                </Box>

                {/* 테이블 헤더 */}
                {/* 헤더 */}
                <Box display="flex" alignItems="center" px={1.5} py={1} color="#888" fontSize="0.85rem">
                    <Box width="25%">소환사 이름</Box>
                    <Box width="10%" textAlign="center">티어</Box>
                    <Box width="20%" textAlign="center">모스트 챔피언</Box>
                    <Box width="45%" textAlign="center">포지션</Box>
                </Box>

                {/* 멤버 리스트 */}
                {members.map((member, i) => (
                    <Box
                        key={i}
                        display="flex"
                        alignItems="center"
                        px={1.5}
                        py={1.2}
                        borderTop="1px solid #393946"
                    >
                        {/* 소환사 이름 */}
                        <Box width="25%" display="flex" alignItems="center" gap={1}>
                            {member.name ? (
                                <>
                                    <Avatar src="/default.png" sx={{ width: 32, height: 32 }} />
                                    <Box>
                                        <Typography fontSize="0.9rem" color="#fff">{member.name}</Typography>
                                        <Typography fontSize="0.75rem" color="#888">#{member.tag}</Typography>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', height: '40px', width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        placeholder="소환사 이름#NA1"
                                        variant="outlined"
                                        onChange={(e) => setSummonerName(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '100%',
                                                borderRadius: '10px 0 0 10px',
                                                backgroundColor: theme.palette.background.input,
                                                border: `1px solid ${theme.palette.border.main}`,
                                                '& fieldset': { borderColor: 'transparent' },
                                                '& input': {
                                                    color: theme.palette.text.primary,
                                                    padding: '10px 12px',
                                                    fontSize: '0.875rem',
                                                }
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={handleVerifySummoner}
                                        sx={{
                                            height: '100%',
                                            borderRadius: '0 10px 10px 0',
                                            backgroundColor: theme.palette.background.input,
                                            color: theme.palette.text.secondary,
                                            border: `1px solid ${theme.palette.border.main}`,
                                            borderLeft: 'none',
                                            px: 2,
                                            minWidth: '64px',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        등록
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        {/* 티어 */}
                        <Box width="10%" textAlign="center">
                            {member.tier ? <TierBadge tier={member.tier} score={member.score} /> : <TierBadge tier='unrank' />}
                        </Box>

                        {/* 모스트 챔피언 */}
                        <Box width="20%" display="flex" justifyContent="center">
                            <ChampionIconList championNames={member.champions || []} />
                        </Box>

                        {/* 포지션 + 삭제버튼 */}
                        <Box width="45%" display="flex" justifyContent="space-between" alignItems="center">
                            <PositionFilterBar
                                positionFilter={member.position || 'nothing'}
                                onPositionClick={(pos) => handleMemberPositionChange(i, pos)}
                                selectedColor="#42E6B5"
                                unselectedColor="#31313E"
                                iconSize={18}
                            />
                            {member.name && (
                                <Button
                                    onClick={() => handleRemoveMember(i)}
                                    sx={{
                                        ml: 1,
                                        minWidth: 0,
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        color: '#aaa',
                                        fontSize: '0.8rem',
                                        '&:hover': {
                                            backgroundColor: '#3a3a4a',
                                        }
                                    }}
                                >
                                    ✕
                                </Button>
                            )}
                        </Box>
                    </Box>
                ))}
                <Box display="flex" gap={2} mt={4}>
                    <Button fullWidth onClick={handleClose} sx={{
                        border: `1px solid ${theme.palette.border.main}`,
                        bgcolor: '#2A2B31', color: '#fff', height: 48, fontWeight: 'bold'
                    }}>
                        취소
                    </Button>
                    <Button fullWidth sx={{ bgcolor: '#42E6B5', color: '#000', height: 48, fontWeight: 'bold' }}>
                        <Typography fontWeight="bold" color="white">등록</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog >
    );
}