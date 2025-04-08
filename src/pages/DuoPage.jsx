// src/pages/DuoPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Avatar,
    IconButton,
    useTheme,
    Select,
    MenuItem,
    FormControl,
    Menu
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TierImage from '../assets/tier.png';
import CreateDuoModal from '../components/CreateDuoModal';
import SummonerInfo from '../components/SummonerInfo';
import TierBadge from '../components/TierBadge';
import PositionIcon from '../components/PositionIcon';
import PositionFilterBar from '../components/PositionFilterBar';

// 더미 데이터에 queueType 추가 (예: "랭크", "일반")
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
        createdAt: '38초 전'
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

    // 현재 사용자 정보 (내 게시물일 경우 점점점 메뉴 표시)
    const currentUser = { name: '롤10년차고인물', tag: '#1234' };

    const handleRegisterDuo = () => {
        setIsModalOpen(true);
    };

    const handlePositionClick = (pos) => {
        setPositionFilter(pos);
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

                {/* DuoHeader: 마지막 칼럼은 메뉴용 */}
                <DuoHeader />

                {/* DuoItem: 각 행에 큐타입 추가 및 메뉴 위치 오른쪽 배치 */}
                {filteredUsers.map((user, idx) => (
                    <DuoItem key={idx} user={user} currentUser={currentUser} />
                ))}
            </Container>
            <CreateDuoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Box>
    );
}

/** 필터 영역 – 기존 DuoPage 코드 유지 */
function FilterBar({
    positionFilter,
    onPositionClick,
    rankType,
    setRankType,
    schoolFilter,
    setSchoolFilter,
    onRegisterDuo
}) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {/* 포지션 아이콘 그룹 */}

            <PositionFilterBar
                positionFilter={positionFilter}
                onPositionClick={onPositionClick}
            />
            {/* 포지션 아이콘 그룹 끝 */}

            {/* 랭크 타입 & 소속 Select */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select
                        sx={{
                            backgroundColor: '#2c2c3a',
                            color: '#fff',
                            borderRadius: 0.8,
                            height: 48,
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: '#424254'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#42E6B5'
                            },
                            '.MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 32px 0 14px',
                                height: '100%'
                            },
                            '& .MuiSelect-icon': {
                                color: '#7B7B8E',
                            },
                        }}
                        value={rankType}
                        onChange={(e) => setRankType(e.target.value)}
                    >
                        <MenuItem value="solo">솔로랭크</MenuItem>
                        <MenuItem value="flex">일반</MenuItem>
                        <MenuItem value="flex">칼바람</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select
                        sx={{
                            backgroundColor: '#2c2c3a',
                            color: '#fff',
                            borderRadius: 0.8,
                            height: 48,
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: '#424254'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#42E6B5'
                            },
                            '.MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 32px 0 14px',
                                height: '100%'
                            },
                            '& .MuiSelect-icon': {
                                color: '#7B7B8E',
                            },
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

            {/* 듀오 등록하기 버튼 */}
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
                        background: 'linear-gradient(90deg, #B36BFF 0%, #FF6BD5 100%)'
                    }
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
    // columns: [소환사, 큐타입, 주 포지션, 티어, 찾는 포지션, 한 줄 소개, 등록 일시, 듀오 신청, 메뉴]
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

/** 테이블 아이템 – 큐타입, 한 줄 소개, 신청 버튼, 내 게시물일 경우 메뉴 포함 */
function DuoItem({ user, currentUser }) {
    // columns: [소환사, 큐타입, 주 포지션, 티어, 찾는 포지션, 한 줄 소개, 등록 일시, 듀오 신청, 메뉴]
    const columns = [2, 1, 1, 1, 1, 3, 1, 1, 0.5];

    const handleApplyDuo = (e) => {
        e.stopPropagation();
        alert(`${user.name} 님께 듀오를 신청했습니다!`);
    };

    // 각 아이템별 메뉴 상태
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

    // 내 게시물 여부 체크 (이름과 태그가 일치하면)
    const isMine = user.name === currentUser.name && user.tag === currentUser.tag;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#2B2C3C',
                px: 2,
                py: 1,
                borderBottom: '2px solid #12121a',
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: '#2E2E38',
                },
            }}
        >
            {/* 소환사 */}
            <Box
                sx={{
                    flex: columns[0],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1,
                }}
            >
                <SummonerInfo name="롤10년차고인물" tag="1234 | 서울과기대" avatarUrl="avatar" />
            </Box>

            {/* 큐 타입 */}
            <Box
                sx={{
                    flex: columns[1],
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography color="#fff" fontSize={14}>
                    {user.queueType}
                </Typography>
            </Box>

            {/* 주 포지션 */}
            <Box sx={{ flex: columns[2], display: 'flex', justifyContent: 'center' }}>
                <PositionIcon position='top' />
            </Box>

            {/* 티어 */}
            <Box
                sx={{
                    flex: columns[3],
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                }}
            >
                <TierBadge tier="emerald" score="1" />
            </Box>

            {/* 찾는 포지션 */}
            <Box sx={{ flex: columns[4], display: 'flex', justifyContent: 'center' }}>
                <PositionIcon position='jungle' />
            </Box>

            {/* 한 줄 소개 – 스크림페이지 스타일 적용 */}
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
                        // ✨ maxHeight 명시적으로 지정 (줄 수 * lineHeight)
                        maxHeight: '3.6em', // 1.4 * 2줄
                    }}

                >
                    {user.message}
                </Box>
            </Box>

            {/* 등록 일시 */}
            <Box sx={{ flex: columns[6], textAlign: 'center' }}>
                <Typography color="#aaa" sx={{ fontSize: 14 }}>{user.createdAt}</Typography>
            </Box>

            {/* 듀오 신청 버튼 – 스크림페이지 스타일 적용 */}
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

            {/* 내 게시물인 경우 오른쪽에 점점점 메뉴 추가 */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end', // 오른쪽 정렬
                    flex: columns[8],
                    minWidth: 40, // 최소 너비 확보
                }}
            >
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
