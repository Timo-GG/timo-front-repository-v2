// src/pages/MyPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, useTheme } from '@mui/material';
import TabHeader from '../components/TabHeader';
import TableHeader from '../components/TableHeader';
import TableItem from '../components/TableItem';
import ChatPage from './ChatPage';
import DuoDetailModal from '/src/components/duo/DuoDetailModal';
import ScrimRequestModal from '../components/scrim/ScrimRequestModal';

// 받은 요청/보낸 요청 예시 데이터
const sampleUsers = [
    {
        name: '롤10년차고인물',
        tag: '1234',
        school: '서울과기대',
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1111.png',
        department: '컴퓨터공학과',
        map: '솔로 랭크',
        tier: 'platinum',
        score: 2,
        message: '현 멀티 2층 최소 다이아 상위듀오 구합니다.',
        type: '듀오',
        createdAt: '38초 전',
    },
    {
        name: '솔랭장인',
        tag: '1111',
        school: '성균관대',
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/4567.png',
        department: '경제학과',
        map: '소환사 협곡',
        tier: 'diamond',
        score: 1,
        message: '팀운이 부족해 탑 듀오 구합니다.',
        type: '내전',
        createdAt: '10분 전',
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

    // URL 쿼리 파라미터 읽기 (props 우선 처리)
    const [searchParams] = useSearchParams();
    const tabFromURL = searchParams.get('tab') === 'chat' ? 2 : 0;
    const roomIdFromURL = searchParams.get('roomId') ? parseInt(searchParams.get('roomId'), 10) : null;

    // 전달받은 props가 있으면 우선 사용 (숫자값인지 확인)
    const tabFromProps = typeof defaultTab === 'number' ? defaultTab : tabFromURL;
    const roomIdFromProps = typeof initialRoomId === 'number' ? initialRoomId : roomIdFromURL;

    const [tab, setTab] = useState(tabFromProps);

    const handleRowClick = (user) => {
        if (user.type === '듀오') setSelectedUser(user);
        else if (user.type === '내전') setSelectedScrim(user);
    };
    useEffect(() => {
        if (searchParams.get('tab') === 'chat') {
            setTab(2);
        }
    }, [searchParams]);
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

                <TabPanel value={tab} index={0}>
                    <TableHeader />
                    {sampleUsers.map((user, idx) => (
                        <Box
                            key={idx}
                            onClick={() => handleRowClick(user)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableItem received user={user} />
                        </Box>
                    ))}
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <TableHeader />
                    {sampleUsers.map((user, idx) => (
                        <Box
                            key={idx}
                            onClick={() => handleRowClick(user)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableItem user={user} sentStatus="완료" />
                        </Box>
                    ))}
                </TabPanel>

                <TabPanel value={tab} index={2}>
                    <ChatPage initialRoomId={null} />
                </TabPanel>
            </Container>

            {selectedUser && (
                <DuoDetailModal
                    open
                    handleClose={() => setSelectedUser(null)}
                    partyData={selectedUser}
                />
            )}

            {selectedScrim && (
                <ScrimRequestModal
                    open
                    handleClose={() => setSelectedScrim(null)}
                    partyId={selectedScrim.id}
                    scrims={[selectedScrim]}
                />
            )}
        </Box>
    );
}
