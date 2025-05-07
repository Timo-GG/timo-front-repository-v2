// src/pages/DuoPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
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
import TierBadge from '/src/components/TierBadge';
import PositionIcon from '/src/components/PositionIcon';
import PositionFilterBar from '/src/components/duo/PositionFilterBar';
import useAuthStore from '../storage/useAuthStore';
import ConfirmRequiredDialog from '../components/ConfirmRequiredDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchAllDuoBoards } from '../apis/redisAPI';

function getRelativeTime(dateString) {
    if (!dateString) return '방금 전';

    const target = new Date(dateString);
    const now = new Date();
    const diffMs = now - target;

    if (isNaN(diffMs)) return '방금 전'; // invalid date fallback

    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60) return `${diffSeconds}초 전`;

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}분 전`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
}


export default function DuoPage() {
    const theme = useTheme();
    const [positionFilter, setPositionFilter] = useState('nothing');
    const [rankType, setRankType] = useState('solo');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openSendDuoModal, setOpenSendDuoModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();
    const { userData } = useAuthStore();

    const { data: duoUsers = [] } = useQuery({
        queryKey: ['duoUsers'],
        queryFn: fetchAllDuoBoards,
        refetchInterval: 5000,
    });

    const currentUser = userData;

    const handleRegisterDuo = () => {
        setIsModalOpen(true);
    };

    const handleUserClick = (userData) => {
        if (userData.name === currentUser.name && userData.tag === currentUser.tag) return;
        setSelectedUser(userData);
    };

    const handleApplyDuo = async () => {
        try {
            const response = await axiosInstance.post(
                '/chat/rooms',
                { opponentId: 1 },
                { withAuth: true }
            );

            const room = response.data.data;
            navigate(`/mypage?tab=chat&roomId=${room.roomId}`, {
                state: {
                    user: {
                        name: room.opponentName,
                        tag: room.opponentTag,
                        avatarUrl: room.opponentAvatarUrl,
                    },
                    shouldJoin: true,
                },
            });
        } catch (err) {
            console.error('[handleApplyDuo] 채팅방 생성 실패:', err);
            alert('채팅방 생성에 실패했습니다.');
        }
    };

    const filteredUsers = duoUsers.filter((user) => {
        if (positionFilter !== 'nothing' && user.position !== positionFilter) return false;
        return true;
    });

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
                {filteredUsers.map((user, idx) => (
                    <DuoItem
                        key={idx}
                        user={user}
                        currentUser={currentUser}
                        onApplyDuo={handleApplyDuo}
                        onUserClick={handleUserClick}
                    />
                ))}
            </Container>

            <CreateDuoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {selectedUser && !openSendDuoModal && (
                <DuoDetailModal
                    open={Boolean(selectedUser)}
                    handleClose={() => setSelectedUser(null)}
                    partyData={selectedUser || {}}
                />
            )}

            {openSendDuoModal && (
                <SendDuoModal
                    open={openSendDuoModal}
                    handleClose={() => {
                        setOpenSendDuoModal(false);
                        setSelectedUser(null);
                    }}
                    userData={selectedUser || {}}
                />
            )}
            <ConfirmRequiredDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} />
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
                    <Select
                        value={schoolFilter}
                        onChange={(e) => setSchoolFilter(e.target.value)}
                        sx={selectStyle}
                    >
                        {tierOptions.map((tier) => (
                            <MenuItem key={tier.value} value={tier.value}>
                                {tier.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Box>
            <Button
                variant="contained"
                sx={registerBtnStyle}
                onClick={onRegisterDuo}
            >
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
                <Box key={i} sx={{ flex: columns[i], textAlign: 'center' }}>{text}</Box>
            ))}
        </Box>
    );
}

function DuoItem({ user, currentUser, onUserClick, onApplyDuo }) {
    const columns = [2, 1, 1, 1, 1, 3, 1, 1, 0.5];
    const isMine = user.name === currentUser.name && user.tag === currentUser.tag;
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <Box
            onClick={() => !isMine && onUserClick(user)}
            sx={itemRowStyle}
        >
            <Box sx={{ flex: columns[0] }}>
                <SummonerInfo name={user.name} avatarUrl={user.avatarUrl} tag={user.tag} school={user.school} />
            </Box>
            <Box sx={{ flex: columns[1], textAlign: 'center' }}>{user.queueType}</Box>
            <Box sx={{ flex: columns[2], textAlign: 'center' }}><PositionIcon position={user.position} /></Box>
            <Box sx={{ flex: columns[3], textAlign: 'center' }}><TierBadge tier={user.tier} score={user.score} /></Box>
            <Box sx={{ flex: columns[4], textAlign: 'center' }}><PositionIcon position={user.lookingForPosition} /></Box>
            <Box sx={{ flex: columns[5], textAlign: 'center' }}>{user.message}</Box>
            <Box sx={{ flex: columns[6], textAlign: 'center' }}>{getRelativeTime(user.createdAt)}</Box>
            <Box sx={{ flex: columns[7], textAlign: 'center' }}>
                <Button variant="contained" sx={applyBtnStyle} onClick={(e) => { e.stopPropagation(); onApplyDuo(user); }}>신청</Button>
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

