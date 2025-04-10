// src/pages/DuoPage.jsx
import React, { useState } from 'react';
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
import TierImage from '../assets/tier.png';
import CreateDuoModal from '/src/components/duo/CreateDuoModal';
import DuoDetailModal from '/src/components/duo/DuoDetailModal';
import SendDuoModal from '/src/components/duo/SendDuoModal';
import SummonerInfo from '/src/components/SummonerInfo';
import TierBadge from '/src/components/TierBadge';
import PositionIcon from '/src/components/PositionIcon';
import PositionFilterBar from '/src/components/duo/PositionFilterBar';

const sampleUsers = [
    {
        name: '롤10년차고인물',
        tag: '1234',
        school: '서울과기대',
        department: '컴퓨터공학과',
        map: '솔로 랭크',
        message:
            '정글과 서폿 듀오 구합니다! 적극적인 소통을 통해 승리를 이끌고 싶습니다.',
        playStyle: '공격적',
        status: '듀오 가능',
        mic: '사용함',
        gender: '남성',
        mbti: 'ENTJ',
        tier: 'platinum',
        score: 2,
        queueType: '랭크',
        mainPosition: 'jungle',
        lookingForPosition: 'support',
        createdAt: '38초 전',
        type: '듀오',
        wins: 7,
        losses: 3,
        members: [
            {
                name: '롤10년차고인물',
                tag: '1234',
                avatarUrl:
                    'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1234.png',
                tier: 'platinum',
                score: 2,
                champions: ['Amumu', 'LeeSin', 'Graves'],
                position: 'jungle',
            },
        ],
    },
    {
        name: '솔랭장인',
        tag: '1111',
        school: '성균관대',
        department: '경제학과',
        map: '소환사 협곡',
        message:
            '팀운이 부족해 탑 듀오 구합니다. 꾸준한 플레이로 팀에 기여할 자신이 있습니다.',
        playStyle: '신중함',
        status: '듀오 가능',
        mic: '사용 안 함',
        gender: '남성',
        mbti: 'ISTJ',
        tier: 'diamond',
        score: 1,
        queueType: '일반',
        mainPosition: 'top',
        lookingForPosition: 'jungle',
        createdAt: '10분 전',
        type: '내전',
        wins: 5,
        losses: 5,
        members: [
            {
                name: '솔랭장인',
                tag: '1111',
                avatarUrl:
                    'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1111.png',
                tier: 'diamond',
                score: 1,
                champions: ['Gnar', 'Shen', 'Malphite'],
                position: 'top',
            },
        ],
    },
];

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ pt: 0 }}>{children}</Box>}
        </div>
    );
}

export default function DuoPage() {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [positionFilter, setPositionFilter] = useState('nothing');
    const [rankType, setRankType] = useState('solo');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 상세정보 모달(DuoDetailModal)용 상태
    const [selectedUser, setSelectedUser] = useState(null);
    // 신청 모달(SendDuoModal)용 상태
    const [openSendDuoModal, setOpenSendDuoModal] = useState(false);

    const currentUser = { name: '롤10년차고인물', tag: '1234' };

    const handleRegisterDuo = () => {
        setIsModalOpen(true);
    };

    const handlePositionClick = (pos) => {
        setPositionFilter(pos);
    };

    // 행 전체 클릭 (신청 버튼 제외): 상세정보 모달 열기
    const handleUserClick = (userData) => {
        // 신청 버튼 외의 부분 클릭 시 DuoDetailModal을 엽니다.
        setSelectedUser(userData);
    };

    // 신청 버튼 클릭: SendDuoModal 열기
    const handleApplyDuo = (userData) => {
        // 신청 버튼 클릭 시 SendDuoModal을 엽니다.
        setSelectedUser(userData);
        setOpenSendDuoModal(true);
    };

    const filteredUsers = sampleUsers.filter((user) => {
        if (positionFilter !== 'nothing' && user.mainPosition !== positionFilter)
            return false;
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

                {/* 테이블 헤더 */}
                <DuoHeader />

                {/* 각 소환사 행 (DuoItem) */}
                {filteredUsers.map((user, idx) => (
                    <DuoItem
                        key={idx}
                        user={user}
                        currentUser={currentUser}
                        // 클릭 시, 행(신청 버튼 제외) 클릭이면 상세정보 모달 열기
                        onUserClick={handleUserClick}
                        // 신청 버튼 클릭 시 SendDuoModal 열기
                        onApplyDuo={handleApplyDuo}
                    />
                ))}
            </Container>

            <CreateDuoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* 상세 정보 모달 (DuoDetailModal): 행 클릭 시 열림 */}
            {selectedUser && !openSendDuoModal && (
                <DuoDetailModal
                    open={Boolean(selectedUser)}
                    handleClose={() => setSelectedUser(null)}
                    partyData={selectedUser || {}}
                />
            )}

            {/* 신청 모달 (SendDuoModal): 신청 버튼 클릭 시 열림 */}
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
        </Box>
    );
}

/** 필터 영역 – 기존 코드 그대로 */
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
                        <MenuItem value="solo">솔로랭크</MenuItem>
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

/** 테이블 헤더 – 수정된 소환사 열 왼쪽 정렬 */
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
        // 신청 버튼 클릭 시 onApplyDuo 호출해서 신청 모달 열기
        if (onApplyDuo) onApplyDuo(user);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
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
            onClick={() => onUserClick(user)}
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
            {/* (1) 소환사 영역: 왼쪽 정렬, 이름 및 태그|학교 2줄 표시 */}
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
                <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#ccc' }}>
                    #{user.tag} | {user.school}
                </Typography>
            </Box>

            {/* (2) 큐 타입 */}
            <Box sx={{ flex: columns[1], display: 'flex', justifyContent: 'center' }}>
                <Typography color="#fff" fontSize={14}>
                    {user.queueType}
                </Typography>
            </Box>

            {/* (3) 주 포지션 */}
            <Box sx={{ flex: columns[2], display: 'flex', justifyContent: 'center' }}>
                <PositionIcon position={user.mainPosition} />
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

            {/* (7) 등록 일시 */}
            <Box sx={{ flex: columns[6], textAlign: 'center' }}>
                <Typography color="#aaa" sx={{ fontSize: 14 }}>
                    {user.createdAt}
                </Typography>
            </Box>

            {/* (8) 신청 버튼: 클릭 시 SendDuoModal 열기 */}
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
                    onClick={handleApplyClick}
                >
                    신청
                </Button>
            </Box>

            {/* (9) 내 게시물 메뉴 (선택사항) */}
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

