// src/pages/MyPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab, useTheme } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import TabHeader from '../components/TabHeader';
import TableHeader from '../components/TableHeader';
import TableItem from '../components/TableItem';
import ChatPage from './ChatPage';
import DuoDetailModal from '../components/duo/DuoDetailModal';
import ScrimRequestModal from '../components/scrim/ScrimRequestModal';
import ReviewModal from '../components/ReviewModal';
import useAuthStore from '../storage/useAuthStore';
import EvaluationTableHeader from '../components/EvaluationTableHeader.jsx'; // ✅ 추가
import EvaluationTableItem from '../components/EvaluationTableItem.jsx';
import {fetchReceivedRequests, fetchSentRequests} from "../apis/redisAPI.js";
import {useQuery} from "@tanstack/react-query"; // ✅ 추가

const evaluationUsers = [
    {
        id: 1,
        name: '롤10년차고인물',
        tag: '1234',
        school: '서울과기대',
        avatarUrl:
            'https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon2098.jpg?image=q_auto:good,f_webp,w_200&v=1744455113',        department: '컴퓨터공학과',
        map: '소환사 협곡',
        position: 'jungle',
        type: '듀오',
        createdAt: '1시간 전',
        mode: 'received',  // 받은 평가
        reviewStatus: 'completed',
        attitude: '성실하게 임해요',
        manner: '매너있는 소환사',
        skill: '한 수 배우고 갑니다',
        score: 5,
        comment: '정말 좋은 플레이어였어요!',
    },
    {
        id: 2,
        name: '솔랭장인',
        tag: '111122',
        school: '성균관대',
        avatarUrl:
            'https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon2098.jpg?image=q_auto:good,f_webp,w_200&v=1744455113',        department: '경제학과',
        map: '소환사 협곡',
        position: 'top',
        type: '내전',
        createdAt: '2시간 전',
        mode: 'sent',  // 보낸 평가
        reviewStatus: 'completed',
        attitude: '노력해요',
        manner: '평범한 소환사',
        skill: '무난한 플레이',
        score: 4,
        comment: '다음에 또 같이 하면 좋겠어요!',
    },
    {
        id: 3,
        name: '로랄로랄',
        tag: '2222',
        school: '서울과기대',
        avatarUrl:
            'https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon2098.jpg?image=q_auto:good,f_webp,w_200&v=1744455113',        department: '시디과',
        map: '소환사 협곡',
        position: 'support',
        type: '듀오',
        createdAt: '3시간 전',
        mode: 'sent',  // 보낸 평가
        reviewStatus: 'pending',  // 평가 대기 상태
        // 리뷰 내용 없음 (작성 필요)
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
    const memberId = userData?.memberId;
    const [mainTab, setMainTab] = useState(defaultTab || 0);
    const [requestSubTab, setRequestSubTab] = useState(0); // 0: 받은 요청, 1: 보낸 요청
    const [evaluationSubTab, setEvaluationSubTab] = useState(0); // 0: 받은 평가, 1: 보낸 평가
    const [searchParams] = useSearchParams();
    const roomIdFromURL = searchParams.get('roomId') ? parseInt(searchParams.get('roomId'), 10) : null;
    const roomIdFromProps = typeof initialRoomId === 'number' ? initialRoomId : roomIdFromURL;

    const { data: receivedUsers = [], refetch: refetchReceived } = useQuery({
        queryKey: ['receivedRequests', memberId],
        queryFn: () => fetchReceivedRequests(memberId),
        enabled: !!memberId,
    });

    const { data: sentUsers = [], refetch: refetchSent } = useQuery({
        queryKey: ['sentRequests', memberId],
        queryFn: () => fetchSentRequests(memberId),
        enabled: !!memberId,
    });

    useEffect(() => {
        if (searchParams.get('tab') === 'chat') {
            setMainTab(1);
        }
    }, [searchParams]);

    const handleRowClick = (user) => {
        if (user.type === '듀오') {
            setSelectedUser(user);
        } else if (user.type === '내전') {
            setSelectedScrim(user);
        }
    };

    const handleEvaluate = (user) => {
        setReviewUser(user);
    };

    const renderSubTabs = (subTab, setSubTab, labels) => (
        <Box
            sx={{
                backgroundColor: '#2B2C3C',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                pt: 0,
                pr: 1,
                pb: 1,
                pl: 1,
                mb: 2,
            }}
        >
            <Tabs
                value={subTab}
                onChange={(_, newValue) => setSubTab(newValue)}
                textColor="inherit"
                TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}
                sx={{
                    '.MuiTabs-indicator': {
                        backgroundColor: '#ffffff',
                    },
                }}
            >
                <Tab label={labels[0]} />
                <Tab label={labels[1]} />
            </Tabs>
        </Box>
    );

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 3 } }}>
                <TabHeader
                    tab={mainTab}
                    onTabChange={(_, newValue) => setMainTab(newValue)}
                    firstLabel="요청"
                    secondLabel="평가"
                    thirdLabel="채팅"
                />

                {mainTab === 0 && (
                    <>
                        {renderSubTabs(requestSubTab, setRequestSubTab, ['받은 요청', '보낸 요청'])}
                        <TabPanel value={requestSubTab} index={0}>
                            <Box sx={{ overflowX: { xs: 'auto', sm: 'visible' } }}>
                                <Box sx={{ minWidth: { xs: '900px', sm: 'auto' } }}>
                                    <TableHeader />
                                    {receivedUsers.map(user => (
                                        <Box key={user.id} onClick={() => handleRowClick(user)} sx={{ cursor: 'pointer' }}>
                                            <TableItem
                                                received={true}
                                                user={user}
                                                onEvaluate={handleEvaluate}
                                                onRequestUpdate={refetchReceived}
                                            />
                                            {/* 중복된 TableItem 제거 */}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value={requestSubTab} index={1}>
                            <Box sx={{ overflowX: { xs: 'auto', sm: 'visible' } }}>
                                <Box sx={{ minWidth: { xs: '900px', sm: 'auto' } }}>
                                    <TableHeader />
                                    {sentUsers.map(user => (
                                        <Box key={user.id} onClick={() => handleRowClick(user)} sx={{ cursor: 'pointer' }}>
                                            <TableItem
                                                received={false}
                                                user={user}
                                                onEvaluate={handleEvaluate}
                                                onRequestUpdate={refetchSent}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </TabPanel>
                    </>
                )}

                {mainTab === 1 && (
                    <>
                        {renderSubTabs(evaluationSubTab, setEvaluationSubTab, ['받은 평가', '보낸 평가'])}
                        <TabPanel value={requestSubTab} index={0}>
                            <Box sx={{ overflowX: { xs: 'auto', sm: 'visible' } }}>
                                <Box sx={{ minWidth: { xs: '900px', sm: 'auto' } }}>
                                    <TableHeader />
                                    {receivedUsers.map(user => (
                                        <Box key={user.id} onClick={() => handleRowClick(user)} sx={{ cursor: 'pointer' }}>
                                            <TableItem
                                                received={true}  // ✅ 받은 요청임을 명시
                                                user={user}
                                                onEvaluate={handleEvaluate}
                                                onRequestUpdate={refetchReceived}  // ✅ 올바른 refetch 함수
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </TabPanel>

                        <TabPanel value={requestSubTab} index={1}>
                            <Box sx={{ overflowX: { xs: 'auto', sm: 'visible' } }}>
                                <Box sx={{ minWidth: { xs: '900px', sm: 'auto' } }}>
                                    <TableHeader />
                                    {sentUsers.map(user => (
                                        <Box key={user.id} onClick={() => handleRowClick(user)} sx={{ cursor: 'pointer' }}>
                                            <TableItem
                                                received={false}  // ✅ 보낸 요청임을 명시 (또는 생략 가능)
                                                user={user}
                                                onEvaluate={handleEvaluate}
                                                onRequestUpdate={refetchSent}  // ✅ 올바른 refetch 함수
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </TabPanel>
                    </>
                )}

                {mainTab === 2 && (
                    <TabPanel value={mainTab} index={2}>
                        <ChatPage initialRoomId={roomIdFromProps} />
                    </TabPanel>
                )}
            </Container>

            {selectedUser && (
                <DuoDetailModal open handleClose={() => setSelectedUser(null)} partyData={selectedUser} />
            )}
            {selectedScrim && (
                <ScrimRequestModal open handleClose={() => setSelectedScrim(null)} partyId={selectedScrim.id} scrims={[selectedScrim]} />
            )}
            <ReviewModal open={Boolean(reviewUser)} handleClose={() => setReviewUser(null)} user={reviewUser} />
        </Box>
    );
}
