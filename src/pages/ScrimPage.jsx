import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SummonerInfo from '../components/SummonerInfo';
import TierBadge from '../components/TierBadge';
import CreateScrimModal from '/src/components//scrim/CreateScrimModal';
import ApplyScrimModal from '/src/components/scrim/ApplyScrimModal';
import ScrimDetailModal from '/src/components/scrim/ScrimDetailModal';
import scrimDummy from '../data/scrimDummy';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// 필요하다면 ChampionIconList, PositionFilterBar 등 기타 컴포넌트도 import

export default function ScrimPage() {
    const theme = useTheme();

    // 탭 상태
    const [tab, setTab] = useState(0);
    const handleTabChange = (e, newValue) => setTab(newValue);

    // 모달 상태
    const [open, setOpen] = useState(false);        // CreateScrimModal 열림 여부
    const [applyOpen, setApplyOpen] = useState(false); // ApplyScrimModal 열림 여부
    const [detailOpen, setDetailOpen] = useState(false);

    // 메뉴(anchorEl) 관련
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuTargetId, setMenuTargetId] = useState(null); // 메뉴가 열릴 때 어떤 row.id인지 저장
    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuTargetId(id);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setMenuTargetId(null);
    };

    // 내가 선택한 파티(내전) ID (상세 모달/수정 등에 사용)
    const [selectedPartyId, setSelectedPartyId] = useState(null);

    // "수정" 시에는 어떤 데이터를 수정할지 필요하므로, 수정 대상 스크림 데이터를 저장
    const [editScrim, setEditScrim] = useState(null);

    // 주기적 리렌더링을 위한 forceRender
    const [forceRender, setForceRender] = useState(false);
    useEffect(() => {
        const timer = setInterval(() => {
            setForceRender(prev => !prev);
        }, 1000); // 1초마다 상대 시간 갱신
        return () => clearInterval(timer);
    }, []);

    // 상대 시간 계산
    const getRelativeTime = (dateString) => {
        if (!dateString) return '방금 전'; // 혹은 '' 등 기본값
        const target = new Date(dateString);
        const now = new Date();
        const diffSec = Math.floor((now - target) / 1000);
        if (diffSec < 0) return '방금 전'; // 미래 시간이 들어올 경우 예외 처리

        if (diffSec < 60) {
            return `${diffSec}초 전`;
        }
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) {
            return `${diffMin}분 전`;
        }
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) {
            return `${diffHour}시간 전`;
        }
        const diffDay = Math.floor(diffHour / 24);
        return `${diffDay}일 전`;
    };

    // (1) 스크림 목록 상태
    const [scrims, setScrims] = useState(scrimDummy);

    // (2) 현재 로그인한 유저
    const currentUser = { name: '롤10년차고인물', tag: '1234', avatarUrl: '/default.png' };

    // (3) 새 스크림 추가 (최신순: 앞에 추가)
    const handleAddScrim = (newScrim) => {
        newScrim.isNew = true;
        setScrims(prev => [newScrim, ...prev]);
        // 일정 시간 뒤 isNew 제거
        setTimeout(() => {
            setScrims(prev =>
                prev.map(scrim =>
                    scrim.id === newScrim.id ? { ...scrim, isNew: false } : scrim
                )
            );
        }, 2000); // 애니메이션과 동일한 시간
    };

    // (4) 스크림 삭제
    const handleDeleteScrim = (id) => {
        setScrims(prev => prev.filter((scrim) => scrim.id !== id));
        handleClose();
    };

    // (5) 수정 버튼 -> ApplyScrimModal 열기
    const handleEditScrim = (id) => {
        // 수정할 대상 찾기
        const found = scrims.find(scrim => scrim.id === id);
        setEditScrim(found || null);
        setApplyOpen(true);    // ApplyScrimModal 열기
        handleClose();         // 메뉴 닫기
    };

    // (6) 수정 완료 시 기존 스크림 업데이트
    const handleUpdateScrim = (updated) => {
        setScrims(prev => {
            return prev.map(scrim => {
                if (scrim.id === updated.id) {
                    return { ...scrim, ...updated };
                }
                return scrim;
            });
        });
    };

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg" sx={{ px: 0 }}>
                {/* 탭 영역 */}
                <Box sx={{ backgroundColor: theme.palette.background.paper, p: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        textColor="inherit"
                        TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}
                    >
                        <Tab label="전체 대학교"
                            sx={{
                                fontSize: "1.1rem",
                                color: tab === 0 ? '#ffffff' : '#B7B7C9',
                                fontWeight: tab === 0 ? 'bold' : 'normal'
                            }}
                        />
                        <Tab label="우리 학교"
                            sx={{
                                fontSize: "1.1rem",
                                color: tab === 1 ? '#ffffff' : '#B7B7C9',
                                fontWeight: tab === 1 ? 'bold' : 'normal'
                            }}
                        />
                    </Tabs>
                </Box>
                <Box sx={{ height: '1px', backgroundColor: '#171717', width: '100%' }} />

                {/* 헤더 */}
                <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
                    <Box sx={{ ml: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h7" color="#42E6B5">
                                콜로세움 게시판
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="white">
                                {tab === 0 ? '전체 대학교' : '서울과기대'}
                            </Typography>
                        </Box>
                        <Button sx={{
                            backgroundColor: '#46CFA7',
                            color: '#fff',
                            borderRadius: 0.5,
                            fontWeight: 'bold',
                            px: 2,
                            py: 1.4
                        }}
                            onClick={() => setOpen(true)}
                        >
                            <Typography variant="h7" fontWeight="bold" color="white">
                                파티 생성하기
                            </Typography>
                        </Button>
                    </Box>
                </Box>

                {/* 테이블 헤더 */}
                <Box>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Box sx={{
                            px: 3, py: 1, display: 'flex', justifyContent: 'space-between',
                            backgroundColor: '#28282F', color: '#999',
                            fontSize: 14, fontWeight: 500
                        }}>
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

                        {/* 테이블 본문 */}
                        {scrims.map((row) => {
                            const isMine = (row.name === currentUser.name && row.tag === currentUser.tag);
                            return (
                                <Box
                                    key={row.id}
                                    onClick={() => {
                                        setSelectedPartyId(row.id);
                                        setDetailOpen(true);
                                    }}
                                    sx={{
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
                                        position: 'relative',
                                        ...(row.isNew && {
                                            animation: 'fadeInHighlight 2s ease',
                                        }),
                                        '&:hover': {
                                            backgroundColor: '#2E2E38',
                                        },
                                        '@keyframes fadeInHighlight': {
                                            '0%': {
                                                backgroundColor: '#7F7F90',
                                                opacity: 0,
                                            },
                                            '100%': {
                                                backgroundColor: theme.palette.background.paper,
                                                opacity: 1,
                                            }
                                        },
                                    }}
                                >
                                    {/* 소환사 */}
                                    <Box width="15%" display="flex">
                                        <SummonerInfo name={row.name} tag={row.tag} avatarUrl={row.avatarUrl} />
                                    </Box>

                                    {/* 맵 */}
                                    <Box width="10%" textAlign="center">{row.map || ''}</Box>

                                    {/* 인원 (문자열 "5:5" 또는 "3:3") */}
                                    <Box width="10%" textAlign="center">
                                        {row.people || ''}
                                    </Box>

                                    {/* 평균 티어 */}
                                    <Box width="10%" textAlign="center">
                                        <TierBadge tier={row.avgTier} score={row.avgScore} />
                                    </Box>

                                    {/* 대학교/학과 */}
                                    <Box width="10%" textAlign="center">
                                        {tab === 0 ? row.university : row.department}
                                    </Box>

                                    {/* 한 줄 소개 */}
                                    <Box width="20%" textAlign="center">
                                        <Box sx={{
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
                                            {row.message}
                                        </Box>
                                    </Box>

                                    {/* 등록 일시 (상대 시간) */}
                                    <Box width="10%" textAlign="center">
                                        {getRelativeTime(row.createdAt)}
                                    </Box>

                                    {/* 내전 신청(버튼) : 내가 만든 게시물이면 안 보이게 */}
                                    <Box width="10%" textAlign="center">
                                        {!isMine && (
                                            <Button sx={{
                                                backgroundColor: '#424254',
                                                color: '#fff',
                                                borderRadius: 0.8,
                                                fontWeight: 'bold',
                                                px: 2, py: 1,
                                                border: '1px solid #71717D'
                                            }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setApplyOpen(true);
                                                }}
                                            >
                                                신청
                                            </Button>
                                        )}
                                    </Box>

                                    {/* 우측 메뉴 (수정/삭제)는 내가 만든 게시물에만 표시 */}
                                    <Box width="2%" textAlign="center">
                                        {isMine && (
                                            <>
                                                <IconButton onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuClick(e, row.id);
                                                }}>
                                                    <MoreVertIcon sx={{ color: '#aaa' }} />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Container>

            {/* 우클릭 메뉴 (수정/삭제) */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleEditScrim(menuTargetId)}>수정</MenuItem>
                <MenuItem onClick={() => handleDeleteScrim(menuTargetId)}>삭제</MenuItem>
            </Menu>

            {/* 파티 생성 모달 */}
            <CreateScrimModal
                open={open}
                handleClose={() => setOpen(false)}
                onCreateScrim={handleAddScrim}
                currentTab={tab} // 현재 탭 정보를 자식 모달에 전달
            />

            {/* ApplyScrimModal: "수정" 재활용 */}
            <ApplyScrimModal
                open={applyOpen}
                handleClose={() => {
                    setApplyOpen(false);
                    setEditScrim(null); // 닫을 때 편집 데이터 초기화
                }}
                editScrim={editScrim}           // 편집할 데이터 (없으면 새 신청의 의미)
                onUpdateScrim={handleUpdateScrim} // 수정 완료 콜백
            />

            {/* 상세 모달 */}
            <ScrimDetailModal
                open={detailOpen}
                handleClose={() => setDetailOpen(false)}
                partyId={selectedPartyId}
                scrims={scrims} // ScrimDetailModal에서 scrims 배열을 참조
            />
        </Box>
    );
}
