// src/pages/DuoPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Button,
    IconButton,
    useTheme,
    Select,
    MenuItem,
    FormControl,
    Menu,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateDuoModal from '/src/components/duo/CreateDuoModal';
import DuoDetailModal from '/src/components/duo/DuoDetailModal';
import SendDuoModal from '/src/components/duo/SendDuoModal';
import SummonerInfo from '/src/components/SummonerInfo';
import LoginModal from '../components/login/LoginModal';
import TierBadge from '/src/components/TierBadge';
import PositionIcon from '/src/components/PositionIcon';
import PositionFilterBar from '/src/components/duo/PositionFilterBar';
import useAuthStore from '../storage/useAuthStore';
import ConfirmRequiredDialog from '../components/ConfirmRequiredDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchAllDuoBoards } from '../apis/redisAPI';
import { getMyInfo } from '../apis/authAPI';
import { useQueryClient } from '@tanstack/react-query';

function getRelativeTime(dateString) {
    if (!dateString) return '방금 전';
    const target = new Date(dateString);
    const now = new Date();
    const diffMs = now - target;
    if (isNaN(diffMs)) return '방금 전';
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}초 전`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}시간 전`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}일 전`;
}

export default function DuoPage() {
    const theme = useTheme();
    const [positionFilter, setPositionFilter] = useState('nothing');
    const [rankType, setRankType] = useState('solo');
    const [schoolFilter, setSchoolFilter] = useState('all');

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [currentBoardUUID, setCurrentBoardUUID] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const location = useLocation();
    const userData = useAuthStore(state => state.userData);
    const { setUserData } = useAuthStore();
    const currentUser = useAuthStore(state => state.userData);
    const [loginModalOpen, setLoginModalOpen] = useState(false); // 로그인 모달 상태 추가

    const queryClient = useQueryClient();
    const isLoggedIn = () => {
        return userData && (userData.accessToken || userData.memberId);
    };
    useEffect(() => {
        const fetchAndUpdateUser = async () => {
            if (isLoggedIn()) {
                try {
                    const updated = await getMyInfo();
                    setUserData(updated.data);
                    console.log('사용자 정보 업데이트 성공:', updated.data);
                } catch (error) {
                    console.log('사용자 정보 업데이트 실패:', error);
                }
            }
        };
        fetchAndUpdateUser();
    }, []); // 빈 의존성 배열로 한 번만 실행

    const { data: duoUsers = [] } = useQuery({
        queryKey: ['duoUsers'],
        queryFn: fetchAllDuoBoards,
        refetchInterval: 5000,
    });

    const handleRegisterDuo = () => {
        console.log('듀오 등록 클릭 - 로그인 상태:', isLoggedIn(), userData);
        if (!isLoggedIn()) {
            setLoginModalOpen(true);
            return;
        }
        setCreateModalOpen(true);
    };

    const handleUserClick = (user) => {
        if (user.name === currentUser.name && user.tag === currentUser.tag) return;
        setSelectedUser(user);
    };

    // “듀오 신청” 버튼 클릭 시 모달 열기
    const handleApplyDuo = (user, boardUUID) => {
        console.log('듀오 신청 클릭 - 로그인 상태:', isLoggedIn(), userData);
        if (!isLoggedIn()) {
            setLoginModalOpen(true);
            return;
        }
        setSelectedUser(user);
        setCurrentBoardUUID(boardUUID);
        setOpenSendModal(true);
    };

    const handleLoginModalClose = () => {
        setLoginModalOpen(false);
        // 로그인 성공 후 상태를 다시 확인
        setTimeout(() => {
            console.log('로그인 모달 닫힌 후 상태:', userData);
        }, 100);
    };

    const filteredUsers = duoUsers
        .filter(u => positionFilter === 'nothing' || u.position.toLowerCase() === positionFilter)

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg">
                <FilterBar
                    positionFilter={positionFilter}
                    onPositionClick={setPositionFilter}
                    rankType={rankType}
                    setRankType={setRankType}
                    schoolFilter={schoolFilter}
                    setSchoolFilter={setSchoolFilter}
                    onRegisterDuo={handleRegisterDuo}
                />
                <DuoHeader />
                {filteredUsers.map((user) => (
                    <DuoItem
                        key={user.id}
                        user={user}
                        currentUser={currentUser}
                        onApplyDuo={() => handleApplyDuo(user, user.id)}
                        onUserClick={handleUserClick}
                    />
                ))}
            </Container>

            <CreateDuoModal
                open={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={() => queryClient.invalidateQueries(['duoUsers'])}
            />

            {selectedUser && !openSendModal && (
                <DuoDetailModal
                    open={Boolean(selectedUser)}
                    handleClose={() => setSelectedUser(null)}
                    partyData={selectedUser}
                />
            )}

            {openSendModal && (
                <SendDuoModal
                    open={openSendModal}
                    boardUUID={currentBoardUUID}
                    userData={selectedUser}
                    handleClose={() => {
                        setOpenSendModal(false);
                        setSelectedUser(null);
                        setCurrentBoardUUID(null);
                    }}
                />
            )}

            {/* 로그인 모달 */}
            <LoginModal
                open={loginModalOpen}
                onClose={handleLoginModalClose}
                redirectTo={location.pathname} // 현재 페이지 경로 전달
            />

            <ConfirmRequiredDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            />
        </Box>
    );
}

const tierOptions = [
    { value: 'all', label: '모든 티어' },
    { value: 'iron', label: '아이언' },
    { value: 'bronze', label: '브론즈' },
    { value: 'silver', label: '실버' },
    { value: 'gold', label: '골드' },
    { value: 'platinum', label: '플래티넘' },
    { value: 'emerald', label: '에메랄드' },
    { value: 'diamond', label: '다이아몬드' },
    { value: 'master', label: '마스터' },
    { value: 'grandmaster', label: '그랜드마스터' },
    { value: 'challenger', label: '챌린저' },
];

function FilterBar({ positionFilter, onPositionClick, rankType, setRankType, schoolFilter, setSchoolFilter, onRegisterDuo }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PositionFilterBar positionFilter={positionFilter} onPositionClick={onPositionClick} />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select value={rankType} onChange={(e) => setRankType(e.target.value)} sx={selectStyle}>
                        <MenuItem value="solo">랭크</MenuItem>
                        <MenuItem value="normal">일반</MenuItem>
                        <MenuItem value="aram">칼바람</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)} sx={selectStyle}>
                        {tierOptions.map((tier) => (
                            <MenuItem key={tier.value} value={tier.value}>
                                {tier.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Button variant="contained" sx={registerBtnStyle} onClick={onRegisterDuo}>
                듀오등록하기
            </Button>
        </Box>
    );
}

function DuoHeader() {
    const columns = [2, 1, 1, 1, 1, 3, 1, 1, 0.5];
    const headers = ['소환사', '큐 타입', '주 포지션', '티어', '찾는 포지션', '한 줄 소개', '등록 일시', '듀오 신청', ''];
    return (
        <Box sx={headerRowStyle}>
            {headers.map((text, i) => (
                <Box key={i} sx={{ flex: columns[i], textAlign: 'center' }}>
                    {text}
                </Box>
            ))}
        </Box>
    );
}

function DuoItem({ user, currentUser, onApplyDuo, onUserClick }) {
    const columns = [2, 1, 1, 1, 1, 3, 1, 1, 0.5];
    const isMine = user.name === currentUser.name && user.tag === currentUser.tag;
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <Box onClick={() => !isMine && onUserClick(user)} sx={itemRowStyle}>
            <Box sx={{ flex: columns[0] }}>
                <SummonerInfo name={user.name} avatarUrl={user.avatarUrl} tag={user.tag} school={user.school} />
            </Box>
            <Box sx={{ flex: columns[1], textAlign: 'center' }}>{user.queueType}</Box>
            <Box sx={{ flex: columns[2], textAlign: 'center' }}>
                <PositionIcon position={user.position} />
            </Box>
            <Box sx={{ flex: columns[3], textAlign: 'center' }}>
                <TierBadge tier={user.tier} score={user.leaguePoint} rank={user.rank} />
            </Box>
            <Box sx={{ flex: columns[4], textAlign: 'center' }}>
                <PositionIcon position={user.lookingForPosition} />
            </Box>
            <Box sx={{ flex: columns[5], textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    maxHeight: '3.6em'
                }}>
                    {user.message}
                </Box>
            </Box>
            <Box sx={{ flex: columns[6], textAlign: 'center' }}>{getRelativeTime(user.createdAt)}</Box>
            <Box sx={{ flex: columns[7], textAlign: 'center' }}>
                <Button variant="contained" sx={applyBtnStyle} onClick={(e) => { e.stopPropagation(); onApplyDuo(); }}>
                    신청
                </Button>
            </Box>
            <Box sx={{ flex: columns[8], textAlign: 'right' }}>
                {isMine && (
                    <>
                        <IconButton onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}>
                            <MoreVertIcon sx={{ color: '#aaa' }} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            <MenuItem onClick={() => alert('수정')}>수정</MenuItem>
                            <MenuItem onClick={() => alert('삭제')}>삭제</MenuItem>
                        </Menu>
                    </>
                )}
            </Box>


        </Box>
    );
}

// 스타일 상수
const selectStyle = {
    backgroundColor: '#2c2c3a',
    color: '#fff',
    borderRadius: 0.8,
    height: 48,
    '.MuiOutlinedInput-notchedOutline': { borderColor: '#424254' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#42E6B5' },
    '.MuiSelect-select': { display: 'flex', alignItems: 'center', padding: '0 32px 0 14px', height: '100%' },
    '& .MuiSelect-icon': { color: '#7B7B8E' },
};

const registerBtnStyle = {
    ml: 'auto',
    fontWeight: 'bold',
    height: 56,
    px: 3,
    background: 'linear-gradient(90deg, #A35AFF 0%, #FF5AC8 100%)',
    color: '#fff',
    fontSize: 16,
    borderRadius: 0.8,
    '&:hover': {
        background: 'linear-gradient(90deg, #B36BFF 0%, #FF6BD5 100%)',
    },
};

const headerRowStyle = {
    display: 'flex',
    alignItems: 'center',
    px: 2,
    py: 1.5,
    fontSize: 14,
    fontWeight: 500,
    color: '#999',
    backgroundColor: '#28282F',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
};

const itemRowStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2B2C3C',
    px: 2,
    py: 1,
    borderBottom: '2px solid #12121a',
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#2E2E38' },
};

const applyBtnStyle = {
    backgroundColor: '#424254',
    color: '#fff',
    borderRadius: 0.8,
    fontWeight: 'bold',
    px: 2,
    py: 1,
    border: '1px solid #71717D',
};
