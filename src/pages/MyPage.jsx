// src/pages/MyPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import TabHeader from '../components/TabHeader';
import TableHeader from '../components/TableHeader';
import TableItem from '../components/TableItem';
import ChatPage from './ChatPage';
import DuoDetailModal from '../components/duo/DuoDetailModal';
import ScrimRequestModal from '../components/scrim/ScrimRequestModal';
import ReviewModal from '../components/ReviewModal';
import useAuthStore from '../storage/useAuthStore';
// 예시 데이터 (sampleUsers) - 받은 요청과 보낸 요청 모두 동일 데이터를 활용 (status에 따라 조건 처리)
const sampleUsers = [
    {
        id: 1,
        name: '롤10년차고인물',
        tag: '1234',
        school: '서울과기대',
        avatarUrl:
            'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1111.png',
        department: '컴퓨터공학과',
        map: '솔로 랭크',
        tier: 'platinum',
        score: 2,
        position: 'jungle',
        message: '현 멀티 2층 최소 다이아 상위듀오 구합니다.',
        playStyle: '즐겜',
        status: '첫판',
        mic: '사용함',
        gender: '남성',
        mbti: 'ENTJ',
        type: '듀오',
        createdAt: '38초 전',
        matchStatus: '', // 빈 상태: 기본적으로 수락/거절 (받은 요청) 또는 취소하기 (보낸 요청) 처리
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
        map: '소환사 협곡',
        tier: 'diamond',
        score: 1,
        position: 'top',
        message: '팀운이 부족해 탑 듀오 구합니다.',
        playStyle: '빡겜',
        status: '계속 플레이',
        mic: '사용 안함',
        gender: '여성',
        mbti: 'ISFJ',
        type: '내전',
        createdAt: '10분 전',
        matchStatus: '평가', // 평가 상태: 평가하기 버튼 노출
        wins: 6,
        losses: 4,
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
        map: '소환사 협곡',
        tier: 'gold',
        score: 3,
        position: 'support',
        message: '원딜 사장님 구합니다!! 충실한 노예 1호입니다.',
        playStyle: '즐겜',
        status: '막판',
        mic: '사용 안함',
        gender: '남성',
        mbti: 'INFP',
        type: '듀오',
        createdAt: '1시간 전',
        matchStatus: '완료', // 완료 상태: 듀오 완료 텍스트 노출
        wins: 5,
        losses: 5,
        champions: ['Neeko', 'Kaisa', 'Ezreal'],
    },
];

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ pt: 0 }}>{children}</Box>}
        </div>
    );
}

export default function MyPage({ defaultTab, initialRoomId }) {
    const theme = useTheme();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedScrim, setSelectedScrim] = useState(null);
    const [reviewUser, setReviewUser] = useState(null);
    const { userData } = useAuthStore();
    console.log('userData:', userData);
    const [tab, setTab] = useState(defaultTab || 0);
    const [searchParams] = useSearchParams();
    const tabFromURL = searchParams.get('tab') === 'chat' ? 2 : 0;
    const roomIdFromURL = searchParams.get('roomId') ? parseInt(searchParams.get('roomId'), 10) : null;
    const roomIdFromProps =
        typeof initialRoomId === 'number' ? initialRoomId : roomIdFromURL;

    useEffect(() => {
        if (searchParams.get('tab') === 'chat') {
            setTab(2);
        }
    }, [searchParams]);



    // 행 클릭 시 호출 (모달 띄우기 예시)
    const handleRowClick = (user) => {
        if (user.type === '듀오') {
            setSelectedUser(user);
        } else if (user.type === '내전') {
            setSelectedScrim(user);
        }
    };

    // TableItem에서 "평가하기" 버튼 클릭 시 호출되는 함수
    const handleEvaluate = (user) => {
        setReviewUser(user);
    };

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg">
                <TabHeader
                    tab={tab}
                    onTabChange={(_, newValue) => setTab(newValue)}
                    firstLabel="받은 요청"
                    secondLabel="보낸 요청"
                    thirdLabel="채팅"
                />

                {/* 받은 요청 탭 */}
                <TabPanel value={tab} index={0}>
                    <TableHeader />
                    {sampleUsers.map((user) => (
                        <Box
                            key={user.id}
                            onClick={() => handleRowClick(user)}
                            sx={{ cursor: 'pointer' }}
                        >
                            {/* received prop 전달: 받은 요청 모드 */}
                            <TableItem received user={user} status={user.matchStatus} onEvaluate={handleEvaluate} />
                        </Box>
                    ))}
                </TabPanel>

                {/* 보낸 요청 탭 */}
                <TabPanel value={tab} index={1}>
                    <TableHeader />
                    {sampleUsers.map((user) => (
                        <Box
                            key={user.id}
                            onClick={() => handleRowClick(user)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableItem user={user} status={user.matchStatus} onEvaluate={handleEvaluate} />
                        </Box>
                    ))}
                </TabPanel>

                {/* 채팅 탭 */}
                <TabPanel value={tab} index={2}>
                    <ChatPage initialRoomId={roomIdFromProps} />
                </TabPanel>
            </Container>

            {/* 듀오 상세 모달 */}
            {selectedUser && (
                <DuoDetailModal
                    open
                    handleClose={() => setSelectedUser(null)}
                    partyData={selectedUser}
                />
            )}

            {/* 내전 상세 모달 */}
            {selectedScrim && (
                <ScrimRequestModal
                    open
                    handleClose={() => setSelectedScrim(null)}
                    partyId={selectedScrim.id}
                    scrims={[selectedScrim]}
                />
            )}

            {/* 리뷰 모달 (평가하기 버튼 클릭 시 열림) */}
            <ReviewModal
                open={Boolean(reviewUser)}
                handleClose={() => setReviewUser(null)}
                user={reviewUser}
            />
        </Box>
    );
}
