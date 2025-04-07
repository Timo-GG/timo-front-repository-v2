import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import TierImage from '../assets/tier.png';
import WinRateBar from './WinRateBar';
import SummonerInfo from './SummonerInfo';
import TierBadge from './TierBadge';
import ChampionIconList from './ChampionIconList';
export default function TableItem({ received, user, sentStatus }) {
    const columns = [1.5, 1, 1.5, 1.5, 2, 0.5, 1, 1.5];

    return (
        <Box sx={{
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
        }}>
            <Box sx={{ flex: columns[0], display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <SummonerInfo name={user.name} tag={user.tag} avatarUrl={user.avatarUrl} />
            </Box>
            <Box sx={{ flex: columns[1], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <TierBadge tier={user.tier} score={user.score} />
            </Box>
            <Box sx={{ flex: columns[3], textAlign: 'center' }}>
                <WinRateBar wins={user.wins || 0} losses={user.losses || 0} />
            </Box>
            <Box sx={{ flex: columns[2], display: 'flex', justifyContent: 'center', gap: 1 }}>
                <ChampionIconList championNames={user.champions} />
            </Box>
            <Box sx={{
                flex: columns[4],
            }}>
                <Box
                    sx={{
                        backgroundColor: '#424254',
                        p: 1,
                        borderRadius: 1,
                        color: '#fff',
                        fontSize: '0.85rem',
                        maxWidth: 180,
                        lineHeight: 1.4,
                        textAlign: 'left',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordWrap: 'break-word',
                        wordBreak: 'break-all',
                        whiteSpace: 'normal',
                        maxHeight: '3.6em',
                    }}
                >
                    {user.message}
                </Box>

            </Box>
            <Box sx={{ flex: columns[5], textAlign: 'center' }}>
                <Typography color="#aaa" sx={{ fontSize: 12 }}>{user.type}</Typography>
            </Box>
            <Box sx={{ flex: columns[6], textAlign: 'center' }}>
                <Typography color="#aaa" sx={{ fontSize: 12 }}>{user.createdAt}</Typography>
            </Box>
            <Box sx={{ flex: columns[7], display: 'flex', gap: 1, justifyContent: 'center' }}>
                {received ? (
                    <>
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
                        >
                            수락
                        </Button>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#F96568',
                                color: '#fff',
                                borderRadius: 0.8,
                                fontWeight: 'bold',
                                px: 2,
                                py: 1,
                                border: '1px solid #F96568', // 거절 버튼은 border도 동일하게 통일
                            }}
                        >
                            거절
                        </Button>
                    </>
                ) : sentStatus === '평가' ? (
                    <Button variant="text" sx={{ color: '#42E6B5' }}>평가하기</Button>
                ) : sentStatus === '완료' ? (
                    <Typography color="#666" sx={{fontSize: 13}}>듀오 완료</Typography>
                ) : (
                    <Button variant="outlined">취소하기</Button>
                )}
            </Box>
        </Box>
    );
}
