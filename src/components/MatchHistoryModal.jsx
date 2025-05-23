import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Avatar,
    Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SummonerInfo from './SummonerInfo';
import TierBadge from './TierBadge';

export default function MatchHistoryModal({ open, onClose, matchData }) {
    const { gameName, tagLine, profileIconUrl, rankInfo, matchSummaries } = matchData;

    // matchSummaries → 화면용 객체

    const matches = matchSummaries.map(m => ({
        result: m.win ? '승리' : '패배',
        resultColor: m.win ? '#3F6E8C' : '#8C4949',
        kda: `${m.kills} / ${m.deaths} / ${m.assists}`,
        champion: m.championIconUrl,
        level: m.championLevel,
        items: m.items,
        spells: m.summonerSpells,
        perks: m.runes,
        time: m.gameDuration,
        queueType: m.gameMode,
        date: m.playedAt,

    }));



    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" scroll="body">
            {/* 헤더 */}
            <Box sx={{ backgroundColor: '#31313C', color: '#fff' }}>
                <DialogTitle sx={{ px: 2, py: 1.2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <SummonerInfo
                            name={gameName}
                            tag={tagLine}
                            avatarUrl={profileIconUrl}
                            copyable
                        />
                        <TierBadge tier={rankInfo.tier} score={rankInfo.lp} rank={rankInfo.rank}/>
                    </Box>
                </DialogTitle>
            </Box>

            {/* 본문 */}
            <DialogContent
                sx={{
                    maxHeight: '55vh',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#AAAAAA',
                        borderRadius: '4px',
                    },
                }}
            >
                {matches.map((match, idx) => {
                    // 1) totalSlots=7, items 순서대로 채우고 없으면 null
                    const BISCUIT_URL =
                        'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/2052.png';

                    // 원본 items 배열
                    const raw = match.items;

                    // 1) 비스킷 여부
                    const hasBiscuit = raw.includes(BISCUIT_URL);

                    // 2) 일반 아이템만 순서대로 뽑아서
                    const otherItems = raw.filter(u => u && u !== BISCUIT_URL);

                    // 3) 7칸 slots 생성: i===3 은 비스킷, 아니면 otherItems 에서 하나씩
                    const slots = Array.from({ length: 7 }, (_, i) => {
                        if (i === 3) {
                            // 4번째 슬롯은 비스킷 자리
                            return hasBiscuit ? BISCUIT_URL : null;
                        } else {
                            // 비스킷 자리 건너뛰고 채우기
                            // 예) i=0,1,2 → otherItems[0,1,2]
                            //     i=4,5,6 → otherItems[3,4,5]
                            const idxOffset = i < 3 ? i : i - 1;
                            return otherItems[idxOffset] ?? null;
                        }
                    });

                    return (
                        <Box
                            key={idx}
                            sx={{
                                p: 1.5,
                                mb: 1,
                                borderRadius: 0.8,
                                backgroundColor: match.resultColor,
                                display: 'grid',
                                gridTemplateColumns: '17% 15% 19% 14% 10% 1fr',
                                alignItems: 'center',
                                columnGap: 1,
                            }}
                        >
                            {/* 승패 · 모드 · 시간 */}
                            <Box>
                                <Typography
                                    fontSize={16}
                                    fontWeight="bold"
                                    color={match.result === '승리' ? '#66CCFF' : '#FF8888'}
                                >
                                    {match.result}
                                </Typography>
                                <Typography fontSize={11}>{match.queueType}</Typography>
                                <Typography fontSize={11} color="#ccc">
                                    {match.time}
                                </Typography>
                                <Typography fontSize={11} color="#ccc">
                                    {match.date}
                                </Typography>
                            </Box>

                            {/* 챔피언 아이콘 */}
                            <Box position="relative">
                                <Avatar src={match.champion} sx={{ width: 56, height: 56 }} />
                                <Box
                                    position="absolute"
                                    bottom={-5}
                                    right={-5}
                                    bgcolor="#000"
                                    borderRadius={1}
                                    px={1}
                                >
                                    <Typography fontSize={12} color="#fff">
                                        {match.level}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* KDA */}
                            <Typography fontSize={14} fontWeight="bold">
                                {match.kda.split(' / ').map((v, i, arr) => (
                                    <span key={i}>
                    <span style={{ color: i === 1 ? 'red' : 'white' }}>{v}</span>
                                        {i < arr.length - 1 && <span style={{ color: 'white' }}> / </span>}
                  </span>
                                ))}
                            </Typography>

                            {/* 룬 & 스펠 */}
                            <Box display="flex" flexDirection="column" gap={0.5}>
                                <Box display="flex">
                                    {match.spells.map((url, i) => (
                                        <Avatar
                                            key={i}
                                            src={url}
                                            sx={{ width: 24, height: 24, mr: 0.5, borderRadius: 0.5 }}
                                        />
                                    ))}
                                </Box>
                                <Box display="flex">
                                    {match.perks.map((url, i) => (
                                        <Avatar
                                            key={i}
                                            src={url}
                                            sx={{ width: 24, height: 24, mr: 0.5, borderRadius: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* 아이템 2줄: 그리드로 4열, 자동으로 2행 */}
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4,24px)',
                                    gridAutoRows: '24px',
                                    gap: '4px',
                                }}
                            >
                                {slots.map((url, i) =>
                                    url ? (
                                        <Avatar
                                            key={i}
                                            src={url}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: i === 3 ? '50%' : 0.5, // 4번째만 둥글게
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: i === 3 ? '50%' : 0.5,
                                                backgroundColor: match.result === '승리' ? '#1567A8' : '#882333',
                                                border: '1px #555',
                                            }}
                                        />
                                    )
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </DialogContent>

            {/* 갱신 버튼 */}
            {/*<Box sx={{ backgroundColor: '#31313C' }}>*/}
            {/*    <Button*/}
            {/*        variant="contained"*/}
            {/*        startIcon={<RefreshIcon sx={{ color: '#fff' }} />}*/}
            {/*        fullWidth*/}
            {/*        sx={{*/}
            {/*            backgroundColor: '#65c7a3',*/}
            {/*            borderRadius: '0 0 8px 8px',*/}
            {/*            py: 1.2,*/}
            {/*            '&:hover': { backgroundColor: '#57b294' },*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Typography fontSize={16} fontWeight="bold" color="#fff">*/}
            {/*            전적 갱신*/}
            {/*        </Typography>*/}
            {/*    </Button>*/}
            {/*</Box>*/}
        </Dialog>
    );
}
