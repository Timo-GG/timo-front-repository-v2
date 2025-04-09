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
import SummonerInfo from '/src/components/SummonerInfo';
import TierBadge from '/src/components/TierBadge';
import PositionIcon from '/src/components/PositionIcon';
import PositionFilterBar from '/src/components/duo/PositionFilterBar';

// sampleUsers 배열 – 각 듀오는 1명의 소환사(멤버) 데이터를 포함하도록 구성
const sampleUsers = [
    {
        name: '롤10년차고인물',
        tag: '1234',
        school: '서울과기대',
        department: '컴퓨터공학과',
        map: '솔로 큐',
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
        name: '화이팅하자고인물',
        tag: '9999',
        school: '고려대',
        department: '경영학과',
        map: '자유 큐',
        message:
            '상체/봇 듀오 구합니다! 팀워크를 중요하게 생각하며, 전략적 플레이로 승리를 도모합니다.',
        playStyle: '전략적',
        status: '바쁨',
        mic: '사용 안 함',
        gender: '여성',
        mbti: 'INTJ',
        tier: 'emerald',
        score: 3,
        queueType: '일반',
        mainPosition: 'top',
        lookingForPosition: 'bottom',
        createdAt: '1분 전',
        members: [
            {
                name: '화이팅하자고인물',
                tag: '9999',
                avatarUrl:
                    'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/9999.png',
                tier: 'emerald',
                score: 3,
                champions: ['Garen', 'Darius', 'Riven'],
                position: 'top',
            },
        ],
    },
    {
        name: '서포터만한다',
        tag: '4567',
        school: '홍익대',
        department: '디자인학과',
        map: '랭크 큐',
        message:
            '유미와 쓰레쉬 듀오 찾습니다! 창의적이고 유연한 플레이로 승리를 이끌어 나가겠습니다.',
        playStyle: '유연함',
        status: '듀오 가능',
        mic: '사용함',
        gender: '남성',
        mbti: 'ISFP',
        tier: 'gold',
        score: 4,
        queueType: '랭크',
        mainPosition: 'support',
        lookingForPosition: 'mid',
        createdAt: '2분 전',
        members: [
            {
                name: '서포터만한다',
                tag: '4567',
                avatarUrl:
                    'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/4567.png',
                tier: 'gold',
                score: 4,
                champions: ['Thresh', 'Braum', 'Leona'],
                position: 'support',
            },
        ],
    },
    {
        name: '솔랭장인',
        tag: '1111',
        school: '성균관대',
        department: '경제학과',
        map: '솔로 큐',
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
        mainPosition: 'nothing',
        lookingForPosition: 'top',
        createdAt: '10분 전',
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

export default function DuoPage() {
    const theme = useTheme();
    const [positionFilter, setPositionFilter] = useState('nothing');
    const [rankType, setRankType] = useState('solo');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 각 소환사 행 클릭 시 전달받은 데이터를 담는 상태 (모달에 전달됨)
    const [selectedUser, setSelectedUser] = useState(null);

    // 현재 사용자 정보 (내 게시물 등 비교에 사용)
    const currentUser = { name: '롤10년차고인물', tag: '1234' };

    const handleRegisterDuo = () => {
        setIsModalOpen(true);
    };

    const handlePositionClick = (pos) => {
        setPositionFilter(pos);
    };

    // 소환사 행 클릭 시 해당 사용자 데이터를 selectedUser에 저장
    const handleUserClick = (userData) => {
        setSelectedUser(userData);
    };

    // 필터 조건에 따른 데이터 필터링 (예시)
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
                        onUserClick={handleUserClick}
                    />
                ))}
            </Container>

            <CreateDuoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* selectedUser가 있을 때 상세정보 모달 열기 */}
            <DuoDetailModal
                open={Boolean(selectedUser)}
                handleClose={() => setSelectedUser(null)}
                // sampleUsers의 객체를 그대로 partyData로 전달
                partyData={selectedUser || {}}
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

    // 내 게시물 여부 (이름, 태그 비교)
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
