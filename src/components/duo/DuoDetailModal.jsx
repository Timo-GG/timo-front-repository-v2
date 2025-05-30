// src/components/duo/DuoDetailModal.jsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Avatar,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import SummonerInfo from '../SummonerInfo';
import TierBadge from '../TierBadge';
import ChampionIconList from '../champion/ChampionIconList';
import PositionIcon from '../PositionIcon';

export default function DuoDetailModal({
    open,
    handleClose,
    partyData,
}) {
    if (!partyData) return null;

    const genderDisplay = {
        MALE: '남자',
        FEMALE: '여자',
        SECRET: '비밀',
    };

    const playStyleDisplay = {
        fun: '즐겜',
        hardcore: '빡겜',
        none: '상관없음'
    }

    const statusDisplay = {
        first: "첫판",
        continue: "계속 플레이",
        last: "마지막판"
    }

    const {
        queueType,
        school = 'XX대학교',
        department = 'XX학과',
        message,
        playStyle,
        status,
        mic,
        gender,
        mbti,
        name,
        tag,
        avatarUrl,
        tier,
        leaguePoint,
        rank,
        position,
        champions,
    } = partyData;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            {/* 상단 헤더 */}
            <Box sx={{ backgroundColor: '#2B2C3C', px: 3, py: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* 왼쪽: 큐 타입 */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontSize="0.75rem" color="#888">
                            큐 타입
                        </Typography>
                        <Typography fontSize="0.75rem" color="#fff">
                            {queueType || ''}
                        </Typography>
                    </Box>

                    {/* 닫기 버튼 */}
                    <IconButton onClick={handleClose} sx={{ color: '#aaa' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* 전체 콘텐츠 영역 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'flex-start',
                    gap: 3,
                    px: 3,
                    pb: 2,
                    backgroundColor: '#2B2C3C',
                }}
            >
                {/* 왼쪽 패널 */}
                <Box
                    sx={{
                        flex: 1,
                        maxHeight: '55vh',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { width: '8px' },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#2B2C3C',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#AAAAAA',
                            borderRadius: '4px',
                        },
                    }}
                >
                    {/* 대학교 / 학과 제목 */}
                    <Box
                        sx={{
                            textAlign: 'center',
                            minHeight: 30,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography fontSize="1rem" color="#A5A5A5">
                            {`${school} ${department}`}
                        </Typography>
                    </Box>

                    {/* 메시지 영역 */}
                    <Box
                        sx={{
                            backgroundColor: '#424254',
                            p: 2,
                            borderRadius: 0.8,
                            color: '#fff',
                            fontSize: '0.9rem',
                            lineHeight: 1.4,
                            textAlign: 'left',
                            mb: 2,
                            minHeight: '100px',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {message || ''}
                    </Box>

                    {/* 추가 정보 영역 */}
                    <Box
                        sx={{
                            backgroundColor: '#282830',
                            p: 2,
                            borderRadius: 1,
                            mb: 3,
                            fontSize: '0.85rem',
                            color: '#DDD',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                rowGap: 1.5,
                                columnGap: 2,
                            }}
                        >
                            <Box>
                                <Typography color="#888" sx={{ fontSize: '0.8rem' }}>플레이스타일</Typography>
                                <Typography>{playStyleDisplay[playStyle] || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography color="#888" sx={{ fontSize: '0.8rem' }}>내 상태</Typography>
                                <Typography>{statusDisplay[status] || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography color="#888" sx={{ fontSize: '0.8rem' }}>마이크</Typography>
                                <Typography>{mic || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography color="#888" sx={{ fontSize: '0.8rem' }}>성별</Typography>
                                <Typography>{genderDisplay[gender] || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography color="#888" sx={{ fontSize: '0.8rem' }}>MBTI</Typography>
                                <Typography>{mbti === "UNKNOWN" ? "비밀" : mbti || '-'}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* 테이블 헤더 */}
                    <Box
                        display="flex"
                        alignItems="center"
                        px={1.5}
                        py={0.5}
                        color="#888"
                        fontSize="0.85rem"
                        sx={{ backgroundColor: '#282830' }}
                    >
                        <Box width="30%">소환사 이름</Box>
                        <Box width="10%" textAlign="center">포지션</Box>
                        <Box width="15%" textAlign="center">티어</Box>
                        <Box width="40%" textAlign="center">모스트 챔피언</Box>
                    </Box>

                    {/* 멤버 리스트 */}
                    <Box
                        display="flex"
                        alignItems="center"
                        px={1.5}
                        py={0.5}
                        borderTop="1px solid #393946"
                    >
                        {/* (1) 소환사 이름 */}
                        <Box width="30%" display="flex" alignItems="center" gap={1}>
                            <SummonerInfo
                                name={name}
                                avatarUrl={avatarUrl}
                                tag={tag}
                                copyable
                            />
                        </Box>

                        {/* (2) 포지션 */}
                        <Box width="10%" textAlign="center">
                            <PositionIcon position={position} />
                        </Box>

                        {/* (3) 티어 */}
                        <Box width="15%" textAlign="center">
                            {tier ? (
                                <TierBadge tier={tier} score={leaguePoint} rank={rank} />
                            ) : (
                                <TierBadge tier="unrank" />
                            )}
                        </Box>

                        {/* (4) 모스트 챔피언 */}
                        <Box width="40%" display="flex" justifyContent="center">
                            <ChampionIconList championNames={champions || []} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}
