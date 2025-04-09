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
    Menu
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TierImage from '../assets/tier.png';
import CreateDuoModal from '/src/components/duo/CreateDuoModal';
import DuoDetailModal from '/src/components/duo/DuoDetailModal';
import SummonerInfo from '/src/components/SummonerInfo';
import TierBadge from '/src/components/TierBadge';
import PositionIcon from '/src/components/PositionIcon';
import PositionFilterBar from '/src/components/duo/PositionFilterBar';

const sampleUsers = [
    {
        name: '롤10년차고인물',
        tag: '#1234',
        school: '서울과기대',
        tier: 'E1',
        queueType: '랭크',
        mainPosition: 'jungle',
        lookingForPosition: 'support',
        message: '정글/서폿 듀오 구합니다!정글/서폿 듀오 구합니다!정글/서폿 듀오 구합니다!정글/서폿 듀오 구합니다!정글/서폿 듀오 구합니다!',
        createdAt: '38초 전',
    },
    {
        name: '화이팅하자고인물',
        tag: '#9999',
        school: '고려대',
        tier: 'E2',
        queueType: '일반',
        mainPosition: 'top',
        lookingForPosition: 'bottom',
        message: '상체/봇 듀오 구합니다!',
        createdAt: '1분 전'
    },
    {
        name: '서포터만한다',
        tag: '#4567',
        school: '홍익대',
        tier: 'E3',
        queueType: '랭크',
        mainPosition: 'support',
        lookingForPosition: 'mid',
        message: '유미/쓰레쉬 장인, 미드 듀오 찾습니다.',
        createdAt: '2분 전'
    },
    {
        name: '솔랭장인',
        tag: '#1111',
        school: '성균관대',
        tier: 'E4',
        queueType: '일반',
        mainPosition: 'nothing',
        lookingForPosition: 'top',
        message: '팀운이 너무 없어요... 탑 듀오 구합니다.',
        createdAt: '10분 전'
    }
];

export default function DuoPage() {
    const theme = useTheme();
    const [positionFilter, setPositionFilter] = useState('nothing');
    const [rankType, setRankType] = useState('solo');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 각 소환사 행 클릭 시 전달받은 데이터를 담는 상태 (모달에 전달됨)
    const [selectedUser, setSelectedUser] = useState(null);

    // 현재 사용자 정보 (내 게시물일 경우 메뉴 표시 등에 사용)
    const currentUser = { name: '롤10년차고인물', tag: '#1234' };

    const handleRegisterDuo = () => {
        setIsModalOpen(true);
    };

    const handlePositionClick = (pos) => {
        setPositionFilter(pos);
    };

    // 소환사 행 클릭 시 호출되어 선택한 사용자의 데이터를 상태에 저장
    const handleUserClick = (userData) => {
        setSelectedUser(userData);
    };

    // 필터 조건에 따른 데이터 필터링 (예시)
    const filteredUsers = sampleUsers.filter((user) => {
        if (positionFilter !== 'nothing' && user.mainPosition !== positionFilter) return false;
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

                {/* 각 소환사 행. onUserClick prop을 전달하여 행 클릭 시 모달 오픈 */}
                {filteredUsers.map((user, idx) => (
                    <DuoItem
                        key={idx}
                        user={user}
                        currentUser={currentUser}
                        onUserClick={handleUserClick}
                    />
                ))}
            </Container>

            <CreateDuoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* selectedUser가 있을 때 상세정보 모달 열기 */}
            <DuoDetailModal
                open={Boolean(selectedUser)}
                handleClose={() => setSelectedUser(null)}
                // 여기서는 sampleUsers의 데이터를 그대로 partyData로 전달.
                // 실제로는 필요한 데이터 매핑(userMapper 등) 로직을 추가할 수 있습니다.
                partyData={selectedUser || {}}
            // 필요하다면 props로 전달하세요.
            />
        </Box>
    );
}

/** 필터 영역 – 기존 코드 그대로 */
function FilterBar({
    positionFilter,
    onPositionClick,
    rankType,
    setRankType,
    schoolFilter,
    setSchoolFilter,
    onRegisterDuo,
}) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PositionFilterBar
                positionFilter={positionFilter}
                onPositionClick={onPositionClick}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select
                        sx={{
                            backgroundColor: '#2c2c3a',
                            color: '#fff',
                            borderRadius: 0.8,
                            height: 48,
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: '#424254',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#42E6B5',
                            },
                            '.MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 32px 0 14px',
                                height: '100%',
                            },
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
                            '.MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 32px 0 14px',
                                height: '100%',
                            },
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

/** 테이블 헤더 – 마지막 메뉴 칼럼 포함 (큐타입 추가) */
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
        ''
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
                <Box key={i} sx={{ flex: columns[i], textAlign: 'center' }}>
                    {text}
                </Box>
            ))}
        </Box>
    );
}

/** 테이블 아이템 – onUserClick 콜백을 받아 행 클릭 시 상세정보 모달을 열도록 처리 */
function DuoItem({ user, currentUser, onUserClick }) {
    const columns = [2, 1, 1, 1, 1, 3, 1, 1, 0.5];

    const handleApplyDuo = (e) => {
        e.stopPropagation();
        alert(`${user.name} 님께 듀오를 신청했습니다!`);
    };

    // 점점점 메뉴 상태
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

    // 내 게시물 여부 (이름, 태그가 일치하면)
    const isMine = user.name === currentUser.name && user.tag === currentUser.tag;

    return (
        // 행 전체를 클릭하면 onUserClick(user)를 호출하여 상세모달에 해당 사용자 정보를 전달
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
                '&:hover': {
                    backgroundColor: '#2E2E38',
                },
            }}
        >
            {/* 소환사 영역 */}
            <Box
                sx={{
                    flex: columns[0],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1,
                }}
            >
                <SummonerInfo name={`${user.name} | ${user.school}`} tag={user.tag} avatarUrl="avatar" />
            </Box>

            {/* 큐 타입 */}
            <Box sx={{ flex: columns[1], display: 'flex', justifyContent: 'center' }}>
                <Typography color="#fff" fontSize={14}>
                    {user.queueType}
                </Typography>
            </Box>

            {/* 주 포지션 */}
            <Box sx={{ flex: columns[2], display: 'flex', justifyContent: 'center' }}>
                <PositionIcon position="top" />
            </Box>

            {/* 티어 */}
            <Box sx={{ flex: columns[3], display: 'flex', justifyContent: 'center' }}>
                <TierBadge tier="emerald" score="1" />
            </Box>

            {/* 찾는 포지션 */}
            <Box sx={{ flex: columns[4], display: 'flex', justifyContent: 'center' }}>
                <PositionIcon position="jungle" />
            </Box>

            {/* 한 줄 소개 */}
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

            {/* 등록 일시 */}
            <Box sx={{ flex: columns[6], textAlign: 'center' }}>
                <Typography color="#aaa" sx={{ fontSize: 14 }}>
                    {user.createdAt}
                </Typography>
            </Box>

            {/* 듀오 신청 버튼 */}
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
                    onClick={handleApplyDuo}
                >
                    신청
                </Button>
            </Box>

            {/* 내 게시물인 경우 점점점 메뉴 */}
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
