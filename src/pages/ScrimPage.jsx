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
import {
    deleteMyScrimBoard,
    fetchAllScrimBoards,
    fetchUnivScrimBoards,
    isExistMyScimBoard,
    refreshScrimBoard
} from '../apis/redisAPI.js';
import {formatRelativeTime, formatTimeUntilExpiry, getExpiryColor} from '../utils/timeUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";
import LoginModal from '../components/login/LoginModal';

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
    const [selectedScrim, setSelectedScrim] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const { isLoggedIn, userData } = useAuthStore();
    const riot = userData?.riotAccount || {};
    const queryClient = useQueryClient();
    const [loginOpen, setLoginOpen] = useState(false);
    const [requiredOpen, setRequiredOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        if (!isLoggedIn) return setLoginOpen(true);
        if (newValue === 1 && !userData?.certifiedUnivInfo) return setRequiredOpen(true);
        setTab(newValue);
    };

    const {
        data: hasExistingScrimBoard,
        refetch: refetchScrimBoardExistence
    } = useQuery({
        queryKey: ['hasMyScrimBoard'],
        queryFn: isExistMyScimBoard,
        enabled: isLoggedIn && !!userData?.memberId,
        refetchInterval: 10000
    });

    const handleRefreshScrim = async () => {
        try {
            setIsRefreshing(true);
            const now = new Date().toISOString();

            queryClient.setQueryData(['scrimBoards', tab], old => {
                if (!old || !old.content) return old;
                const updatedContent = old.content.map(item => {
                    if (item.name === riot.accountName && item.tag === riot.accountTag) {
                        return { ...item, updatedAt: now };
                    }
                    return item;
                }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                return { ...old, content: updatedContent };
            });

            await refreshScrimBoard();
            toast.success('스크림 게시글이 끌어올려졌습니다!');
        } catch (err) {
            console.error("스크림 끌어올리기 실패", err);
            toast.error("끌어올리기에 실패했습니다.");
        } finally {
            setIsRefreshing(false);
            queryClient.invalidateQueries(['scrimBoards']);
            queryClient.invalidateQueries(['hasMyScrimBoard']);
        }
    };

    const pageSize = 30;
    const { data: scrimData, isLoading } = useQuery({
        queryKey: ['scrimBoards', tab],
        queryFn: () =>
            tab === 0
                ? fetchAllScrimBoards(0, pageSize)
                : fetchUnivScrimBoards(0, pageSize, userData.certifiedUnivInfo?.univName || ''),
        enabled: tab === 0 || (!!userData?.certifiedUnivInfo && isLoggedIn),
        refetchInterval: 5000,
    });

    const scrims = scrimData?.content || [];

    const handleAddScrim = () => {
        queryClient.invalidateQueries(['scrimBoards']);
        queryClient.invalidateQueries(['hasMyScrimBoard']);
    };

    const handleDeleteScrim = async (id) => {
        queryClient.setQueryData(['scrimBoards', tab], old => {
            if (!old || !old.content) return old;
            return { ...old, content: old.content.filter(item => item.id !== id) };
        });

        try {
            await deleteMyScrimBoard();
            toast.success('게시글이 삭제되었습니다.');
        } catch (e) {
            console.error('스크림 삭제 실패:', e);
            toast.error('삭제에 실패했습니다.');
        } finally {
            queryClient.invalidateQueries(['scrimBoards']);
            queryClient.invalidateQueries(['hasMyScrimBoard']);
        }
    };

    const handleEditScrim = (id) => {
        const found = scrims.find(scrim => scrim.id === id);
        setEditScrim(found || null);
        setOpen(true);
        handleClose();
    };

    const handleUpdateScrim = (updatedData) => {
        if (!updatedData) return;
        queryClient.setQueryData(['scrimBoards', tab], old => {
            if (!old || !old.content) return old;
            const newContent = old.content.map(item =>
                item.id === updatedData.id ? { ...item, ...updatedData } : item
            );
            return { ...old, content: newContent };
        });
        queryClient.invalidateQueries(['scrimBoards']);
        queryClient.invalidateQueries(['hasMyScrimBoard']);
        toast.success("게시글이 수정되었습니다.");
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
        <Box sx={{backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5}}>
            <Container maxWidth="lg" sx={{px: {xs: 1, sm: 3}}}>
                <Box sx={{
                    backgroundColor: theme.palette.background.paper,
                    p: 1,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        textColor="inherit"
                        TabIndicatorProps={{style: {backgroundColor: '#ffffff'}}}
                        sx={{px: {xs: 1, sm: 2}}}
                    >
                        <Tab label="전체 대학교" sx={{
                            fontSize: '1.1rem',
                            color: tab === 0 ? '#ffffff' : '#B7B7C9',
                            fontWeight: tab === 0 ? 'bold' : 'normal'
                        }}/>
                        <Tab label="우리 학교" sx={{
                            fontSize: '1.1rem',
                            color: tab === 1 ? '#ffffff' : '#B7B7C9',
                            fontWeight: tab === 1 ? 'bold' : 'normal'
                        }}/>
                    </Tabs>
                </Box>

                <Box sx={{height: '1px', backgroundColor: '#171717', width: '100%'}}/>

                <Box sx={{p: 2, backgroundColor: theme.palette.background.paper}}>
                    <Box sx={{ml: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Box>
                            <Typography variant="h7" color="#42E6B5">콜로세움 게시판</Typography>
                            <Typography variant="h5" fontWeight="bold"
                                        color="white">{tab === 0 ? '전체 대학교' : userData.certifiedUnivInfo.univName}</Typography>
                        </Box>
                        <Button
                            sx={{
                                background: hasExistingScrimBoard
                                    ? 'linear-gradient(90deg, #FF8A5A 0%, #FFB85A 100%)'
                                    : 'linear-gradient(90deg, #46CFA7 0%, #42E6B5 100%)',
                                color: '#fff',
                                borderRadius: 0.5,
                                fontWeight: 'bold',
                                px: 2,
                                py: 1.4
                            }}
                            onClick={() => {
                                if (!isLoggedIn) return setLoginOpen(true);
                                if (!userData?.riotAccount || !userData?.certifiedUnivInfo) return setRequiredOpen(true);

                                if (hasExistingScrimBoard) {
                                    handleRefreshScrim();
                                } else {
                                    setOpen(true);
                                }
                            }}
                        >
                            <Typography variant="h7" fontWeight="bold" color="white">
                                {isRefreshing ? '끌어올리는 중...' : hasExistingScrimBoard ? '게시물 끌어올리기' : '파티 생성하기'}
                            </Typography>
                        </Button>
                    </Box>
                </Box>

                <Box sx={{overflowX: {xs: 'auto', sm: 'visible'}}}>
                    <Box sx={{minWidth: {xs: '900px', sm: 'auto'}}}>
                        <Box sx={{
                            px: 3,
                            py: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: '#28282F',
                            color: '#999',
                            fontSize: {xs: 12, sm: 14},
                            fontWeight: 500
                        }}>
                            <Box width="15%" textAlign="center">소환사</Box>
                            <Box width="10%" textAlign="center">맵</Box>
                            <Box width="10%" textAlign="center">인원</Box>
                            <Box width="10%" textAlign="center">티어</Box>
                            <Box width="10%" textAlign="center">{tab === 0 ? '대학교' : '학과'}</Box>
                            <Box width="20%" textAlign="center">한 줄 소개</Box>
                            <Box width="10%" textAlign="center">등록 일시</Box>
                            <Box width="10%" textAlign="center">만료 일시</Box>
                            <Box width="2%" textAlign="center"></Box>
                        </Box>
                        {isLoading ? (
                            <Box sx={{textAlign: 'center', py: 4, color: '#fff'}}>
                                <CircularProgress sx={{color: '#A35AFF'}}/>
                            </Box>
                        ) : scrims.length === 0 ? (
                            <Box sx={{
                                textAlign: 'center',
                                py: 4,
                                color: '#666',
                                backgroundColor: '#2B2C3C',
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10
                            }}>
                                <Typography>등록된 내전 게시물이 없습니다.</Typography>
                            </Box>
                        ) : (
                            scrims.map((row) => {
                                const isMine = row.name === riot?.accountName && row.tag === riot?.accountTag;
                                return (
                                    <Box key={row.id} onClick={() => {
                                        setSelectedPartyId(row.id);
                                        setDetailOpen(true);
                                    }} sx={{
                                        px: 3,
                                        py: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: theme.palette.background.paper,
                                        color: '#fff',
                                        fontSize: 14,
                                        borderBottom: '2px solid #12121a',
                                        cursor: 'pointer',
                                        '&:hover': {backgroundColor: '#2E2E38'}
                                    }}>
                                        <Box width="15%" display="flex">
                                            <SummonerInfo name={row.name} tag={row.tag} avatarUrl={row.avatarUrl}/>
                                        </Box>
                                        <Box width="10%" textAlign="center">{row.queueType}</Box>
                                        <Box width="10%"
                                             textAlign="center">{row.headCount ? `${row.headCount}:${row.headCount}` : ''}</Box>
                                        <Box width="10%" textAlign="center">
                                            <TierBadge tier={row.party?.[0]?.tier} score={row.party?.[0]?.lp}
                                                       rank={row.party?.[0]?.rank}/>
                                        </Box>
                                        <Box width="10%"
                                             textAlign="center">{tab === 0 ? row.school : row.department}</Box>
                                        <Box width="20%" textAlign="center">
                                            <Box
                                                sx={{
                                                    backgroundColor: '#424254',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    fontSize: '0.85rem',
                                                    lineHeight: 1.4,
                                                    textAlign: 'left',
                                                    display: '-webkit-inline-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'normal',
                                                    maxHeight: {xs: '3.2em', sm: '3.6em'}
                                                }}
                                            >{row.message}</Box>
                                        </Box>
                                        <Box width="10%" textAlign="center">{formatRelativeTime(row.updatedAt)}</Box>
                                        <Box width="10%" textAlign="center" sx={{
                                            fontSize: {xs: '0.7rem', sm: '0.75rem'},
                                            color: getExpiryColor(row.updatedAt)
                                        }}>{formatTimeUntilExpiry(row.updatedAt)}</Box>
                                        <Box width="2%" textAlign="center">
                                            {isMine && (
                                                <>
                                                    <IconButton onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMenuClick(e, row.id);
                                                    }}>
                                                        <MoreVertIcon sx={{color: '#aaa'}}/>
                                                    </IconButton>
                                                    <Menu anchorEl={anchorEl} open={menuTargetId === row.id}
                                                          onClose={handleClose}>
                                                        <MenuItem onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditScrim(row.id);
                                                        }}>수정</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteScrim(row.id);
                                                        }}>삭제</MenuItem>
                                                    </Menu>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })
                        )}
                    </Box>
                </Box>
            </Container>
            <CreateScrimModal open={open}
                              handleClose={() => {
                                  setOpen(false);
                                  setEditScrim(null);
                              }} onCreateScrim={handleAddScrim}
                              currentTab={tab} editScrim={editScrim} onUpdateScrim={handleUpdateScrim}/>
            <ScrimDetailModal open={detailOpen} handleClose={() => setDetailOpen(false)} partyId={selectedPartyId}
                              scrims={scrims}/>
            <ConfirmRequiredDialog open={requiredOpen} onClose={() => setRequiredOpen(false)}/>
            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)}/>
        </Box>
    );
}
