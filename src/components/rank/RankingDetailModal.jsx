import React from 'react';
import {
    Dialog, Box, Typography, IconButton, Avatar, useTheme

} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TierBadge from '../TierBadge';
import ChampionIconList from '/src/components/champion/ChampionIconList';
import PositionIcon from '../PositionIcon';
import SummonerInfo from '../SummonerInfo';

export default function RankingDetailModal({ open, handleClose, data }) {
    const theme = useTheme();
    if (!data) return null;


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box sx={{ backgroundColor: '#2B2C3C' }}>
                {/* 헤더 */}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2, ml: 1, mr: 1 }}>
                    <Typography fontSize="1.2rem" color="#fff">상세정보</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Box>
            </Box>
            <Box
                mb={1}
                sx={{
                    height: '1.2px',
                    backgroundColor: '#171717',
                    width: '100%',
                }}
            />
            <Box sx={{ p: 2, ml: 1, mr: 1 }}>
                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr"
                    columnGap={4}
                    mb={3}
                >
                    {/* 학교 */}
                    <Box mb={3}>
                        <Typography fontSize="0.85rem" color="#888">학교</Typography>
                        <Typography fontSize="0.8rem" color="#fff">{data.university}</Typography>
                    </Box>

                    {/* 학과 */}
                    <Box mb={3}>
                        <Typography fontSize="0.85rem" color="#888">학과</Typography>
                        <Typography fontSize="0.8rem" color="#fff">{data.department}</Typography>
                    </Box>

                    {/* MBTI */}
                    <Box mb={3}>
                        <Typography fontSize="0.85rem" color="#888">MBTI</Typography>
                        <Typography fontSize="0.8rem" color="#fff">{data.mbti}</Typography>
                    </Box>

                    {/* 성별 */}
                    <Box mb={3}>
                        <Typography fontSize="0.85rem" color="#888">성별</Typography>
                        <Typography fontSize="0.8rem" color="#fff">{data.gender}</Typography>
                    </Box>
                </Box>

                {/* 메모 */}
                <Typography fontSize="0.85rem" color="#888">메모</Typography>
                <Box fontSize="0.8rem" sx={{ backgroundColor: '#424254', p: 1.3, borderRadius: 1, color: '#fff', mt: 1, mb: 2 }}>
                    {data.message}
                </Box>

                {/* 소환사 정보 테이블 헤더 */}
                <Box sx={{ overflow: 'hidden' }}>
                    <Box
                        sx={{
                            px: 0,
                            py: 1,
                            display: 'flex',
                            backgroundColor: '#28282F',
                            color: '#999',
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                    >
                        <Box width="30%" textAlign="center">소환사</Box>
                        <Box width="20%" textAlign="center">주 포지션</Box>
                        <Box width="20%" textAlign="center">티어</Box>
                        <Box width="30%" textAlign="center">모스트 챔피언</Box>
                    </Box>
                </Box>

                {/* 소환사 정보 데이터 */}
                <Box
                    key={data.rank}
                    sx={{
                        px: 0,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.paper,
                        color: '#fff',
                        fontSize: 14,
                        borderTop: '1px solid #3c3d4e',
                    }}
                >
                    <Box width="30%" display="flex" justifyContent="center">
                        <SummonerInfo name={data.name} tag={data.tag} avatarUrl={data.avatarUrl} />
                    </Box>
                    <Box width="20%" textAlign="center">
                        <PositionIcon position={data.position} />
                    </Box>
                    <Box width="20%" textAlign="center">
                        <TierBadge tier={data.tier} score={data.score} />
                    </Box>
                    <Box width="30%" textAlign="center">
                        <ChampionIconList championNames={data.champions} />
                    </Box>
                </Box>

            </Box>
        </Dialog>
    );
}