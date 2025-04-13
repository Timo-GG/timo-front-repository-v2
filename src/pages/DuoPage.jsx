// src/pages/DuoPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../apis/axiosInstance';
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
import useChatStore from '../storage/useChatStore';

function getRelativeTime(dateString) {
    if (!dateString) return '방금 전';
    const target = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - target) / 1000);
    if (diffSeconds < 60) return `${diffSeconds}초 전`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}시간 전`;
}

// 초기 듀오 데이터 예시
const sampleUsers = [
    {
        id: 1,
        name: '롤10년차고인물',
        tag: '1234',
        school: '서울과기대',
        avatarUrl:
            'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1111.png',
        department: '컴퓨터공학과',
        queueType: '랭크',
        message:
            '정글과 서폿 듀오 구합니다! 적극적인 소통을 통해 승리를 이끌고 싶습니다.',
        playStyle: '즐겜',
        status: '첫판',
        mic: '사용함',
        gender: '남성',
        mbti: 'ENTJ',
        tier: 'platinum',
        score: 2,
        position: 'jungle',
        lookingForPosition: 'support',
        createdAt: new Date(new Date().getTime() - 38000).toISOString(),
        type: '듀오',
        wins: 7,
        losses: 3,
        champions: ['Amumu', 'LeeSin', 'Graves'],
    },
    {
        id: 2,
        name: '솔랭장인',
        tag: '1111',
        school: '성균관대',
        avatarUrl:
            'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/4567.png',
        department: '경제학과',
        queueType: '일반',
        message:
            '팀운이 부족해 탑 듀오 구합니다. 꾸준한 플레이로 팀에 기여할 자신이 있습니다.',
        playStyle: '빡겜',
        status: '계속 플레이',
        mic: '사용 안함',
        gender: '여성',
        mbti: 'ISFJ',
        tier: 'diamond',
        score: 1,
        position: 'top',
        lookingForPosition: 'jungle',
        createdAt: new Date(new Date().getTime() - 600000).toISOString(),
        type: '내전',
        wins: 5,
        losses: 5,
        champions: ['Gnar', 'Shen', 'Malphite'],
    },
    {
        id: 3,
        name: '로랄로랄',
        tag: '2222',
        school: '서울과기대',
        avatarUrl:
            'https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon2098.jpg?image=q_auto:good,f_webp,w_200&v=1744455113',
        department: '시디과',
        queueType: '랭크',
        message: '원딜 사장님 구합니다!! 충실한 노예 1호입니다.',
        playStyle: '즐겜',
        status: '막판',
        mic: '사용 안함',
        gender: '남성',
        mbti: 'INFP',
        tier: 'gold',
        score: 3,
        position: 'support',
        lookingForPosition: 'bottom',
        createdAt: new Date(new Date().getTime() - 900000).toISOString(),
        type: '듀오',
        wins: 5,
        losses: 5,
        champions: ['Neeko', 'Kaisa', 'Ezreal'],
    },
];

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ pt: 0 }}>{children}</Box>}</div>;
}

export default function DuoPage() {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [positionFilter, setPositionFilter] = useState('nothing');
    const [rankType, setRankType] = useState('solo');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openSendDuoModal, setOpenSendDuoModal] = useState(false);
    const [duoUsers, setDuoUsers] = useState(sampleUsers);
    const [forceRender, setForceRender] = useState(false);
    const { isLoggedIn, userData, isEmailVerified, isSummonerVerified } = useAuthStore();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();
    const { setChatList } = useChatStore();

    useEffect(() => {
        const timer = setInterval(() => {
            setForceRender(prev => !prev);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const currentUser = userData;

    const handleRegisterDuo = () => {
        // if (!isLoggedIn) {
        //     alert('로그인 후 사용 가능합니다.');
        //     return;
        // }
        // if (!isEmailVerified || !isSummonerVerified) {
        //     setOpenConfirmDialog(true);
        //     return;
        // }
        setIsModalOpen(true);
    };

    // 새로운 듀오 등록 시 리스트에 추가 (CreateDuoModal에서 호출)
    const handleAddDuo = (newDuo) => {
        setDuoUsers((prev) => [newDuo, ...prev]);
    };

    const handlePositionClick = (pos) => {
        setPositionFilter(pos);
    };

    const handleUserClick = (userData) => {
        if (userData.name === currentUser.name && userData.tag === currentUser.tag) return;
        setSelectedUser(userData);
    };

    // 신청 버튼 클릭 시, 해당 행의 정보를 기반으로 채팅방 생성 및 이동
    const handleApplyDuo = async (userDataRow) => {
        try {
            // ✅ API 호출: 상대방 ID를 담아 POST
            const response = await axiosInstance.post(
                '/chat/rooms',
                { opponentId: 1 },
                { withAuth: true } // ✅ 토큰 붙이기
            );

            const room = response.data.data; // ChatRoomResponse(roomId, 상대 정보 포함)

            // ✅ 채팅 페이지로 이동 (user 정보 state로 넘김)
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
                    onPositionClick={handlePositionClick}
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

            <CreateDuoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onCreateDuo={handleAddDuo} />

            {selectedUser && !openSendDuoModal && (
                <DuoDetailModal
                    open={Boolean(selectedUser)}
                    handleClose={() => setSelectedUser(null)}
                    partyData={selectedUser || {}} />
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

function FilterBar({ positionFilter, onPositionClick, rankType, setRankType, schoolFilter, setSchoolFilter, onRegisterDuo }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PositionFilterBar positionFilter={positionFilter} onPositionClick={onPositionClick} />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select
                        sx={{
                            backgroundColor: '#2c2c3a',
                            color: '#fff',
                            borderRadius: 0.8,
                            height: 48,
                            '.MuiOutlinedInput-notchedOutline': { borderColor: '#424254' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#42E6B5' },
                            '.MuiSelect-select': { display: 'flex', alignItems: 'center', padding: '0 32px 0 14px', height: '100%' },
                            '& .MuiSelect-icon': { color: '#7B7B8E' },
                        }}
                        value={rankType}
                        onChange={(e) => setRankType(e.target.value)}
                    >
                        <MenuItem value="solo">랭크</MenuItem>
                        <MenuItem value="flex">일반</MenuItem>
                        <MenuItem value="aram">칼바람</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select
                        sx={{
                            backgroundColor: '#2c2c3a',
                            color: '#fff',
                            borderRadius: 0.8,
                            height: 48,
                            '.MuiOutlinedInput-notchedOutline': { borderColor: '#424254' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#42E6B5' },
                            '.MuiSelect-select': { display: 'flex', alignItems: 'center', padding: '0 32px 0 14px', height: '100%' },
                            '& .MuiSelect-icon': { color: '#7B7B8E' },
                        }}
                        value={schoolFilter}
                        onChange={(e) => setSchoolFilter(e.target.value)}
                    >
                        <MenuItem value="all">모든 티어</MenuItem>
                        <MenuItem value="서울과기대">아이언</MenuItem>
                        <MenuItem value="고려대">브론즈</MenuItem>
                        <MenuItem value="홍익대">실버</MenuItem>
                        <MenuItem value="성균관대">골드</MenuItem>
                        <MenuItem value="성균관대">플레티넘</MenuItem>
                        <MenuItem value="성균관대">에메랄드</MenuItem>
                        <MenuItem value="성균관대">다이아</MenuItem>
                        <MenuItem value="성균관대">마스터</MenuItem>
                        <MenuItem value="성균관대">그랜드마스터</MenuItem>
                        <MenuItem value="성균관대">챌린저</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Button
                variant="contained"
                sx={{
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
                }}
                onClick={onRegisterDuo}
            >
                듀오등록하기
            </Button>
        </Box>
    );
}

function DuoHeader() {
    const columns = [2, 1, 1, 1, 1, 3, 1, 1, 0.5];
    const headers = [
        '소환사',
        '큐 타입',
        '주 포지션',
        '티어',
        '찾는 포지션',
        '한 줄 소개',
        '등록 일시',
        '듀오 신청',
        '',
    ];
    return (
        <Box
            sx={{
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
            }}
        >
            {headers.map((text, i) => (
                <Box key={i} sx={{ flex: columns[i], textAlign: i === 0 ? 'left' : 'center' }}>
                    {text}
                </Box>
            ))}
        </Box>
    );
}

function DuoItem({ user, currentUser, onUserClick, onApplyDuo }) {
    const columns = [2, 1, 1, 1, 1, 3, 1, 1, 0.5];

    const handleApplyClick = (e) => {
        e.stopPropagation();
        if (onApplyDuo) onApplyDuo(user);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuClick = (e) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);
    const handleEdit = () => {
        handleMenuClose();
        alert('수정 로직 실행');
    };
    const handleDelete = () => {
        handleMenuClose();
        alert('삭제 로직 실행');
    };

    const isMine = user.name === currentUser.name && user.tag === currentUser.tag;

    return (
        <Box
            onClick={() => {
                if (!isMine) onUserClick(user);
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#2B2C3C',
                px: 2,
                py: 1,
                borderBottom: '2px solid #12121a',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#2E2E38' },
            }}
        >
            {/* (1) 소환사 영역 */}
            <Box
                sx={{
                    flex: columns[0],
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    gap: 0.5,
                }}
            >
                <SummonerInfo name={user.name} avatarUrl={user.avatarUrl} tag={user.tag} school={user.school} />
            </Box>

            {/* (2) 큐 타입 */}
            <Box sx={{ flex: columns[1], display: 'flex', justifyContent: 'center' }}>
                <Typography color="#fff" fontSize={14}>
                    {user.queueType}
                </Typography>
            </Box>

            {/* (3) 주 포지션 */}
            <Box sx={{ flex: columns[2], display: 'flex', justifyContent: 'center' }}>
                <PositionIcon position={user.position} />
            </Box>

            {/* (4) 티어 */}
            <Box sx={{ flex: columns[3], display: 'flex', justifyContent: 'center' }}>
                <TierBadge tier={user.tier} score={user.score} />
            </Box>

            {/* (5) 찾는 포지션 */}
            <Box sx={{ flex: columns[4], display: 'flex', justifyContent: 'center' }}>
                <PositionIcon position={user.lookingForPosition} />
            </Box>

            {/* (6) 한 줄 소개 */}
            <Box sx={{ flex: columns[5], textAlign: 'center' }}>
                <Box
                    sx={{
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
                    }}
                >
                    {user.message}
                </Box>
            </Box>

            {/* (7) 등록 일시 (상대 시간으로 갱신) */}
            <Box sx={{ flex: columns[6], textAlign: 'center' }}>
                <Typography color="#aaa" sx={{ fontSize: 14 }}>
                    {getRelativeTime(user.createdAt)}
                </Typography>
            </Box>

            {/* (8) 신청 버튼 */}
            <Box sx={{ flex: columns[7], display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#424254',
                        color: '#fff',
                        borderRadius: 0.8,
                        fontWeight: 'bold',
                        px: 2,
                        py: 1,
                        border: '1px solid #71717D',
                    }}
                    onClick={(e) => {
                        handleApplyClick(e);
                    }}
                >
                    신청
                </Button>
            </Box>

            {/* (9) 내 게시물 메뉴 */}
            <Box sx={{ flex: columns[8], display: 'flex', justifyContent: 'flex-end', minWidth: 40 }}>
                {isMine && (
                    <>
                        <IconButton onClick={handleMenuClick}>
                            <MoreVertIcon sx={{ color: '#aaa' }} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleEdit}>수정</MenuItem>
                            <MenuItem onClick={handleDelete}>삭제</MenuItem>
                        </Menu>
                    </>
                )}
            </Box>
        </Box>
    );
}
