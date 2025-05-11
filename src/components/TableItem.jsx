import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SummonerInfo from './SummonerInfo';
import TierBadge from './TierBadge';
import WinRateBar from './WinRateBar';
import ChampionIconList from './champion/ChampionIconList';
import TruncatedMessageBox from './TruncatedMessageBox';

export default function TableItem({ received, user }) {
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
                '&:hover': { backgroundColor: '#2E2E38' },
                minWidth: { xs: '900px', sm: 'auto' },
            }}
        >
            <Box sx={{ flex: columns[0], display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <SummonerInfo name={user.name} tag={user.tag} school={user.school} avatarUrl={user.avatarUrl} />
            </Box>
            <Box sx={{ flex: columns[1], display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                <TierBadge tier={user.tier} score={user.lp} rank={user.rank} />
            </Box>
            <Box sx={{ flex: columns[3], textAlign: 'center', minWidth: 0 }}>
                <WinRateBar wins={user.wins || 0} losses={user.losses || 0} />
            </Box>
            <Box sx={{ flex: columns[2], display: 'flex', justifyContent: 'center', gap: 0.5, minWidth: 0 }}>
                <ChampionIconList championNames={user.champions} />
            </Box>
            <Box sx={{ flex: columns[4], display: 'flex', justifyContent: 'center', minWidth: 0 }}>
                <TruncatedMessageBox message={user.message} />
            </Box>
            <Box sx={{ flex: columns[5], textAlign: 'center', minWidth: 0 }}>
                <Typography color="#aaa" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{user.type}</Typography>
            </Box>
            <Box sx={{ flex: columns[6], textAlign: 'center', minWidth: 0 }}>
                <Typography color="#aaa" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{user.createdAt}</Typography>
            </Box>
            <Box sx={{ flex: columns[7], display: 'flex', gap: 0.5, justifyContent: 'center', minWidth: 0 }}>
                {received ? (
                    <>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#424254',
                                color: '#fff',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                px: { xs: 1, sm: 2 },
                                py: { xs: 0.5, sm: 1 },
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
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
                                px: { xs: 1, sm: 2 },
                                py: { xs: 0.5, sm: 1 },
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            }}
                        >
                            거절
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#39394C',
                            color: '#fff',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            px: { xs: 1, sm: 2 },
                            py: { xs: 0.5, sm: 1 },
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        }}
                    >
                        취소하기
                    </Button>
                )}
            </Box>
        </Box>
    );
}
