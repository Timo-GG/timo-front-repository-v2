// src/components/TableItem.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SummonerInfo from './SummonerInfo';
import TierBadge from './TierBadge';
import WinRateBar from './WinRateBar';
import ChampionIconList from './champion/ChampionIconList';
import TruncatedMessageBox from './TruncatedMessageBox';

export default function TableItem({ received, user, status, onEvaluate }) {
    const columns = [1.5, 1, 1.5, 1.5, 2, 0.5, 1, 1.5];

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
            {/* 프로필 및 소환사 정보 */}
            <Box sx={{ flex: columns[0], display: 'flex', alignItems: 'center', gap: 1 }}>
                <SummonerInfo
                    name={user.name}
                    tag={user.tag}
                    school={user.school}
                    avatarUrl={user.avatarUrl}
                />
            </Box>
            {/* 티어 배지 */}
            <Box sx={{ flex: columns[1], display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TierBadge tier={user.tier} score={user.score} />
            </Box>
            {/* 승률 */}
            <Box sx={{ flex: columns[3], textAlign: 'center' }}>
                <WinRateBar wins={user.wins || 0} losses={user.losses || 0} />
            </Box>
            {/* 챔피언 아이콘 */}
            <Box sx={{ flex: columns[2], display: 'flex', justifyContent: 'center', gap: 1 }}>
                <ChampionIconList championNames={user.champions} />
            </Box>
            {/* 요청 메시지 */}
            <Box sx={{ flex: columns[4], display: 'flex', justifyContent: 'center' }}>
                <TruncatedMessageBox message={user.message} />
            </Box>
            {/* 요청 타입 (듀오/내전 등) */}
            <Box sx={{ flex: columns[5], textAlign: 'center' }}>
                <Typography color="#aaa" sx={{ fontSize: 12 }}>
                    {user.type}
                </Typography>
            </Box>
            {/* 생성 시간 */}
            <Box sx={{ flex: columns[6], textAlign: 'center' }}>
                <Typography color="#aaa" sx={{ fontSize: 12 }}>
                    {user.createdAt}
                </Typography>
            </Box>
            {/* 상태별 버튼 영역 */}
            <Box sx={{ flex: columns[7], display: 'flex', gap: 1, justifyContent: 'center' }}>
                {received ? (
                    // 받은 요청 → 수락 / 거절
                    <>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#424254',
                                color: '#fff',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                px: 2,
                                py: 1,
                                border: '1px solid #71717D',
                            }}
                        >
                            수락
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#F96568',
                                color: '#fff',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                px: 2,
                                py: 1,
                                border: '1px solid #F96568',
                            }}
                        >
                            거절
                        </Button>
                    </>
                ) : (
                    // 보낸 요청 → 취소하기
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#39394C',
                            color: '#fff',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            px: 2,
                            py: 1,
                            border: '1px solid #56566A',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#4A4A5C',
                                borderColor: '#56566A',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        취소하기
                    </Button>
                )}
            </Box>
        </Box>
    );
}
