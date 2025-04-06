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
    FormControl
} from '@mui/material';
import TierImage from '../assets/tier.png';
import CreateDuoModal from '../components/CreateDuoModal';

const getPositionImage = (position) => {
    return `/src/assets/position/${position}.png`;
};

const sampleUsers = [
    {
        name: '롤10년차고인물',
        tag: '#1234',
        school: '서울과기대',
        tier: 'E1',
        mainPosition: 'jungle',
        lookingForPosition: 'support',
        message: '한 멀티 최소 다이아 상위듀오 구합니다.',
        createdAt: '38초 전'
    },
    {
        name: '화이팅하자고인물',
        tag: '#9999',
        school: '고려대',
        tier: 'E2',
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
        mainPosition: 'nothing',
        lookingForPosition: 'top',
        message: '팀운이 너무 없어요... 탑 듀오 구합니다.',
        createdAt: '10분 전'
    }
];

export default function DuoPage() {
    const theme = useTheme();
    const [positionFilter, setPositionFilter] = useState('all');
    const [rankType, setRankType] = useState('solo');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRegisterDuo = () => {
        setIsModalOpen(true);
    };

    const handlePositionClick = (pos) => {
        setPositionFilter(pos);
    };

    // 필터 조건에 따른 데이터 필터링 (예시)
    const filteredUsers = sampleUsers.filter((user) => {
        if (positionFilter !== 'all' && user.mainPosition !== positionFilter) {
            return false;
        }
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
                    <DuoItem key={idx} user={user} />
                ))}
            </Container>
            {/* CreateDuoModal 모달 컴포넌트 */}
            <CreateDuoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Box>
    );
}

/** 필터 영역 */
function FilterBar({
    positionFilter,
    onPositionClick,
    rankType,
    setRankType,
    schoolFilter,
    setSchoolFilter,
    onRegisterDuo
}) {
    const positions = ['nothing', 'top', 'jungle', 'mid', 'bottom', 'support'];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {/* 포지션 아이콘 그룹 */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#2c2c3a',
                    borderRadius: 2,
                    px: 1,
                    py: 0.5
                }}
            >
                {positions.map((pos, index) => (
                    <Box
                        key={pos}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ...(index > 0 && {
                                borderLeft: '1px solid #424254',
                                ml: 1,
                                pl: 1
                            })
                        }}
                    >
                        <IconButton
                            onClick={() => onPositionClick(pos)}
                            sx={{
                                width: 48,
                                height: 48,
                                backgroundColor: positionFilter === pos ? '#424254' : 'transparent',
                                borderRadius: 1,
                                p: 0,
                                '&:hover': {
                                    backgroundColor: '#424254'
                                }
                            }}
                        >
                            <Avatar
                                src={getPositionImage(pos)}
                                sx={{ width: 32, height: 32, backgroundColor: 'transparent' }}
                                variant="square"
                            />
                        </IconButton>
                    </Box>
                ))}
            </Box>

            {/* 랭크 타입 & 소속 Select */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select
                        sx={{
                            backgroundColor: '#2c2c3a',
                            color: '#fff',
                            borderRadius: 2,
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
                            }
                        }}
                        value={rankType}
                        onChange={(e) => setRankType(e.target.value)}
                    >
                        <MenuItem value="solo">솔로랭크</MenuItem>
                        <MenuItem value="flex">자유랭크</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" size="small" sx={{ height: 48 }}>
                    <Select
                        sx={{
                            backgroundColor: '#2c2c3a',
                            color: '#fff',
                            borderRadius: 2,
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
                            }
                        }}
                        value={schoolFilter}
                        onChange={(e) => setSchoolFilter(e.target.value)}
                    >
                        <MenuItem value="all">소속 전체</MenuItem>
                        <MenuItem value="서울과기대">서울과기대</MenuItem>
                        <MenuItem value="고려대">고려대</MenuItem>
                        <MenuItem value="홍익대">홍익대</MenuItem>
                        <MenuItem value="성균관대">성균관대</MenuItem>
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

/** 테이블 헤더 */
function DuoHeader() {
    const columns = [1.5, 1, 1, 1, 3, 1, 1.5];
    const headers = [
        '소환사',
        '주 포지션',
        '티어',
        '찾는 포지션',
        '한 줄 소개',
        '등록 일시',
        '듀오 신청'
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
                backgroundColor: '#2c2c3a',
                borderRadius: 2,
                mb: 1
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

/** 테이블 아이템 */
function DuoItem({ user }) {
    const columns = [1.5, 1, 1, 1, 3, 1, 1.5];

    const handleApplyDuo = () => {
        alert(`${user.name} 님께 듀오를 신청했습니다!`);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#2c2c3a',
                borderRadius: 2,
                px: 2,
                py: 2,
                mt: 1
            }}
        >
            {/* 소환사 */}
            <Box
                sx={{
                    flex: columns[0],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1
                }}
            >
                <Avatar alt="소환사" src="/src/assets/icon.png" sx={{ width: 40, height: 40 }} />
                <Box textAlign="left">
                    <Typography color="#fff" fontWeight="bold" noWrap>
                        {user.name}
                    </Typography>
                    <Typography color="#888" fontSize={12} noWrap>
                        {user.tag} | {user.school}
                    </Typography>
                </Box>
            </Box>

            {/* 주 포지션 */}
            <Box sx={{ flex: columns[1], display: 'flex', justifyContent: 'center' }}>
                <Avatar src={getPositionImage(user.mainPosition)} sx={{ width: 36, height: 36 }} />
            </Box>

            {/* 티어 */}
            <Box
                sx={{
                    flex: columns[2],
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <Avatar src={TierImage} sx={{ width: 28, height: 28 }} />
                <Typography color="#42E6B5" fontWeight="bold">
                    {user.tier}
                </Typography>
            </Box>

            {/* 찾는 포지션 */}
            <Box sx={{ flex: columns[3], display: 'flex', justifyContent: 'center' }}>
                <Avatar src={getPositionImage(user.lookingForPosition)} sx={{ width: 36, height: 36 }} />
            </Box>

            {/* 한줄소개 */}
            <Box sx={{ flex: columns[4], textAlign: 'center' }}>
                <Typography
                    sx={{
                        backgroundColor: '#3b3c4f',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        color: '#fff',
                        fontSize: 14
                    }}
                >
                    {user.message}
                </Typography>
            </Box>

            {/* 등록 일시 */}
            <Box sx={{ flex: columns[5], textAlign: 'center' }}>
                <Typography color="#aaa">{user.createdAt}</Typography>
            </Box>

            {/* 듀오 신청 버튼 */}
            <Box sx={{ flex: columns[6], display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#424254',
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: '#56566c'
                        }
                    }}
                    onClick={handleApplyDuo}
                >
                    신청
                </Button>
            </Box>
        </Box>
    );
}
