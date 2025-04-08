// PartyList.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    IconButton,
    Container,
    Tabs,
    Tab,
    Menu,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SummonerInfo from '../components/SummonerInfo';
import TierBadge from '../components/TierBadge';
import CreateScrimModal from '../components/CreateScrimModal';
import ApplyScrimModal from '../components/ApplyScrimModal';
import scrimDummy from '../data/scrimDummy';
import { useTheme } from '@mui/material/styles';
const ChampionIconList = ({ championNames }) => (
    <Box display="flex" gap={0.5}>
        {championNames.map((name, idx) => (
            <Avatar key={idx} src={`/champions/${name}.png`} sx={{ width: 24, height: 24 }} />
        ))}
    </Box>
);

const PositionFilterBar = ({ positionFilter, onPositionClick, selectedColor, unselectedColor }) => (
    <Box display="flex" gap={1} justifyContent="center">
        {['Top', 'Jungle', 'Mid', 'ADC', 'Support'].map(pos => (
            <Button
                key={pos}
                onClick={() => onPositionClick(pos)}
                sx={{
                    minWidth: 0,
                    fontSize: '0.75rem',
                    color: positionFilter === pos ? selectedColor : unselectedColor,
                    padding: 0,
                }}
            >
                {pos}
            </Button>
        ))}
    </Box>
);

const defaultMember = {
    name: '',
    tag: '',
    tier: null,
    score: null,
    champions: [],
    position: null
};

export default function ScrimPage() {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [open, setOpen] = useState(false);
    const [applyOpen, setApplyOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleTabChange = (e, newValue) => setTab(newValue);
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleEdit = () => { handleClose(); };
    const handleDelete = () => { handleClose(); };

    const currentUser = { name: '롤10년차고인물', tag: '1234' };
    const [members, setMembers] = useState(Array(5).fill(defaultMember));
    const [summonerInputs, setSummonerInputs] = useState(Array(5).fill(""));

    const handleRemoveMember = (index) => {
        setMembers((prev) => {
            const newMembers = [...prev];
            newMembers[index] = defaultMember;
            return newMembers;
        });
    };

    const handleVerifySummoner = (index) => {
        const [name, tag] = summonerInputs[index].split('#');
        if (!name || !tag) {
            alert("형식이 올바르지 않습니다 (예: 짱아깨비#KR)");
            return;
        }
        const dummy = {
            name,
            tag,
            tier: 'Gold',
            score: 77,
            champions: ['Ahri', 'Jinx', 'Nautilus'],
            position: 'Mid'
        };
        setMembers((prev) => {
            const newMembers = [...prev];
            newMembers[index] = dummy;
            return newMembers;
        });
        setSummonerInputs((prev) => {
            const updated = [...prev];
            updated[index] = '';
            return updated;
        });
    };

    const handleMemberPositionChange = (index, pos) => {
        setMembers((prev) => {
            const newMembers = [...prev];
            newMembers[index].position = pos;
            return newMembers;
        });
    };

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg" sx={{ px: 0 }}>
                <Box sx={{ backgroundColor: theme.palette.background.paper, p: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        textColor="inherit"
                        TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}
                    >
                        <Tab label="전체 대학교" sx={{ fontSize: "1.1rem", color: tab === 0 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 0 ? 'bold' : 'normal' }} />
                        <Tab label="우리 학교" sx={{ fontSize: "1.1rem", color: tab === 1 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 1 ? 'bold' : 'normal' }} />
                    </Tabs>
                </Box>
                <Box sx={{ height: '1px', backgroundColor: '#171717', width: '100%' }} />
                <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
                    <Box sx={{ ml: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h7" color="#42E6B5">콜로세움 게시판</Typography>
                            <Typography variant="h5" fontWeight="bold" color="white">{tab === 0 ? '전체 대학교' : '서울과기대'}</Typography>
                        </Box>
                        <Button sx={{ backgroundColor: '#46CFA7', color: '#fff', borderRadius: 0.5, fontWeight: 'bold', px: 2, py: 1.4 }} onClick={() => setOpen(true)}>
                            <Typography variant="h7" fontWeight="bold" color="white">파티 생성하기</Typography>
                        </Button>
                    </Box>
                </Box>

                <Box>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Box sx={{ px: 3, py: 1, display: 'flex', justifyContent: 'space-between', backgroundColor: '#28282F', color: '#999', fontSize: 14, fontWeight: 500 }}>
                            <Box width="15%" textAlign="center">소환사</Box>
                            <Box width="10%" textAlign="center">맵</Box>
                            <Box width="10%" textAlign="center">인원</Box>
                            <Box width="10%" textAlign="center">평균 티어</Box>
                            <Box width="10%" textAlign="center">{tab === 0 ? '대학교' : '학과'}</Box>
                            <Box width="20%" textAlign="center">한 줄 소개</Box>
                            <Box width="10%" textAlign="center">등록 일시</Box>
                            <Box width="10%" textAlign="center">내전 신청</Box>
                            <Box width="2%" textAlign="center"></Box>
                        </Box>

                        {scrimDummy.map((row) => {
                            const isMine = row.name === currentUser.name && row.tag === currentUser.tag;
                            return (
                                <Box key={row.id} sx={{ px: 3, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.palette.background.paper, color: '#fff', fontSize: 14, borderBottom: '2px solid #12121a', cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { backgroundColor: '#2E2E38' } }}>
                                    <Box width="15%" display="flex">
                                        <SummonerInfo name={row.name} tag={row.tag} avatarUrl={row.avatarUrl} />
                                    </Box>
                                    <Box width="10%" textAlign="center">{row.map}</Box>
                                    <Box width="10%" textAlign="center">{row.peopleCount}</Box>
                                    <Box width="10%" textAlign="center"><TierBadge tier={row.avgTier} score={row.avgScore} /></Box>
                                    <Box width="10%" textAlign="center">{tab === 0 ? row.university : row.department}</Box>
                                    <Box width="20%" textAlign="center"><Box sx={{
                                        backgroundColor: '#424254',
                                        p: 1,
                                        borderRadius: 1,
                                        color: '#fff',
                                        fontSize: '0.85rem',
                                        lineHeight: 1.4,
                                        textAlign: 'left',
                                        display: '-webkit-inline-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'normal',
                                        maxHeight: '3.6em',
                                    }}>
                                        {row.message}</Box></Box>
                                    < Box width="10%" textAlign="center">{row.time}</Box>
                                    <Box width="10%" textAlign="center">
                                        <Button sx={{ backgroundColor: '#424254', color: '#fff', borderRadius: 0.8, fontWeight: 'bold', px: 2, py: 1, border: '1px solid #71717D' }} onClick={() => setApplyOpen(true)}>신청</Button>
                                    </Box>
                                    <Box width="2%" textAlign="center">
                                        {isMine && (
                                            <>
                                                <IconButton onClick={handleMenuClick}><MoreVertIcon sx={{ color: '#aaa' }} /></IconButton>
                                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                                    <MenuItem onClick={handleEdit}>수정</MenuItem>
                                                    <MenuItem onClick={handleDelete}>삭제</MenuItem>
                                                </Menu>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Container>
            <CreateScrimModal open={open} handleClose={() => setOpen(false)} />
            <ApplyScrimModal open={applyOpen} handleClose={() => setApplyOpen(false)} />
        </Box>
    );
}