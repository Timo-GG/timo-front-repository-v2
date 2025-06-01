import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Container,
    Tabs,
    Tab,
    Menu,
    MenuItem,
    CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SummonerInfo from '../components/SummonerInfo';
import TierBadge from '../components/TierBadge';
import CreateScrimModal from '/src/components/scrim/CreateScrimModal';
import ApplyScrimModal from '/src/components/scrim/ApplyScrimModal';
import ScrimDetailModal from '/src/components/scrim/ScrimDetailModal';
import { useTheme } from '@mui/material/styles';
import useAuthStore from '../storage/useAuthStore';
import ConfirmRequiredDialog from '../components/ConfirmRequiredDialog';
import { deleteMyScrimBoard, fetchAllScrimBoards } from '../apis/redisAPI.js';
import { formatRelativeTime } from '../utils/timeUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function ScrimPage() {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [open, setOpen] = useState(false);
    const [applyOpen, setApplyOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuTargetId, setMenuTargetId] = useState(null);
    const [selectedPartyId, setSelectedPartyId] = useState(null);
    const [editScrim, setEditScrim] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const { isLoggedIn, userData } = useAuthStore();
    const currentUser = userData;
    const queryClient = useQueryClient();

    const handleTabChange = (e, newValue) => setTab(newValue);

    const pageSize = 30;
    const { data: scrimData, isLoading } = useQuery({
        queryKey: ['scrimBoards', tab],
        queryFn: () => fetchAllScrimBoards(0, pageSize),
        refetchInterval: 5000,
    });

    const scrims = scrimData?.content || [];

    const handleAddScrim = (newScrim) => {
        queryClient.invalidateQueries(['scrimBoards']);
    };

    const handleDeleteScrim = async (id) => {
        try {
            await deleteMyScrimBoard();
            queryClient.invalidateQueries(['scrimBoards']);
            handleClose();
        } catch (e) {
            console.error('스크림 삭제 실패:', e);
        }
    };

    const handleEditScrim = (id) => {
        const found = scrims.find(scrim => scrim.id === id);
        setEditScrim(found || null);
        setApplyOpen(true);
        handleClose();
    };

    const handleUpdateScrim = (updated) => {
        queryClient.invalidateQueries(['scrimBoards']);
    };

    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuTargetId(id);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setMenuTargetId(null);
    };

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg" sx={{ px: 0 }}>
                <Box sx={{ backgroundColor: theme.palette.background.paper, p: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <Tabs value={tab} onChange={handleTabChange} textColor="inherit" TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}>
                        <Tab label="전체 대학교" sx={{ fontSize: '1.1rem', color: tab === 0 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 0 ? 'bold' : 'normal' }} />
                        <Tab label="우리 학교" sx={{ fontSize: '1.1rem', color: tab === 1 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 1 ? 'bold' : 'normal' }} />
                    </Tabs>
                </Box>
                <Box sx={{ height: '1px', backgroundColor: '#171717', width: '100%' }} />

                <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
                    <Box sx={{ ml: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h7" color="#42E6B5">콜로세움 게시판</Typography>
                            <Typography variant="h5" fontWeight="bold" color="white">{tab === 0 ? '전체 대학교' : '서울과기대'}</Typography>
                        </Box>
                        <Button sx={{ backgroundColor: '#46CFA7', color: '#fff', borderRadius: 0.5, fontWeight: 'bold', px: 2, py: 1.4 }} onClick={() => {
                            if (!isLoggedIn) return alert('로그인이 필요합니다.');
                            setOpen(true);
                        }}>
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
                        {isLoading ? (
                            <Box sx={{ textAlign: 'center', py: 4, color: '#fff' }}>
                                <CircularProgress sx={{ color: '#A35AFF' }} />
                            </Box>
                        ) : (
                            scrims.map((row) => {
                                const isMine = row.name === currentUser?.name && row.tag === currentUser?.tag;
                                return (
                                    <Box key={row.id} onClick={() => { setSelectedPartyId(row.id); setDetailOpen(true); }} sx={{ px: 3, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.palette.background.paper, color: '#fff', fontSize: 14, borderBottom: '2px solid #12121a', cursor: 'pointer', '&:hover': { backgroundColor: '#2E2E38' } }}>
                                        <Box width="15%" display="flex">
                                            <SummonerInfo name={row.name} tag={row.tag} avatarUrl={row.avatarUrl} />
                                        </Box>
                                        <Box width="10%" textAlign="center">{row.queueType}</Box>
                                        <Box width="10%" textAlign="center">{row.headCount ? `${row.headCount}:${row.headCount}` : ''}</Box>
                                        <Box width="10%" textAlign="center">
                                            <TierBadge tier={row.party?.[0]?.tier} score={row.party?.[0]?.lp} rank={row.party?.[0]?.rank} />
                                        </Box>
                                        <Box width="10%" textAlign="center">{tab === 0 ? row.school : row.department}</Box>
                                        <Box width="20%" textAlign="center">
                                            <Box sx={{ backgroundColor: '#424254', p: 1, borderRadius: 1, color: '#fff', fontSize: '0.85rem', lineHeight: 1.4, textAlign: 'left', display: '-webkit-inline-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', maxHeight: '3.6em' }}>{row.message}</Box>
                                        </Box>
                                        <Box width="10%" textAlign="center">{formatRelativeTime(row.updatedAt)}</Box>
                                        <Box width="10%" textAlign="center">
                                            {!isMine && (
                                                <Button sx={{ backgroundColor: '#424254', color: '#fff', borderRadius: 0.8, fontWeight: 'bold', px: 2, py: 1, border: '1px solid #71717D' }} onClick={(e) => { e.stopPropagation(); setApplyOpen(true); }}>신청</Button>
                                            )}
                                        </Box>
                                        <Box width="2%" textAlign="center">
                                            {isMine && (
                                                <IconButton onClick={(e) => { e.stopPropagation(); handleMenuClick(e, row.id); }}>
                                                    <MoreVertIcon sx={{ color: '#aaa' }} />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })
                        )}
                    </Box>
                </Box>
            </Container>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => handleEditScrim(menuTargetId)}>수정</MenuItem>
                <MenuItem onClick={() => handleDeleteScrim(menuTargetId)}>삭제</MenuItem>
            </Menu>
            <CreateScrimModal open={open} handleClose={() => setOpen(false)} onCreateScrim={handleAddScrim} currentTab={tab} />
            <ApplyScrimModal open={applyOpen} handleClose={() => { setApplyOpen(false); setEditScrim(null); }} editScrim={editScrim} onUpdateScrim={handleUpdateScrim} />
            <ScrimDetailModal open={detailOpen} handleClose={() => setDetailOpen(false)} partyId={selectedPartyId} scrims={scrims} />
            <ConfirmRequiredDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} />
        </Box>
    );
}
