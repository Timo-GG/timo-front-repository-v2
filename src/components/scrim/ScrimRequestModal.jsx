// src/components/scrim/ScrimRequestModal.jsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import SummonerInfo from '../SummonerInfo';
import TierBadge from '../TierBadge';
import ChampionIconList from '../champion/ChampionIconList';
import PositionIcon from '../PositionIcon';

export default function ScrimRequestModal({
    open,
    handleClose,
    partyId,
    scrims = [],
}) {
    // scrims 배열에서 partyId에 해당하는 내전(파티) 찾기
    const partyData = scrims.find(item => item.id === partyId);
    if (!partyData) return null;

    // 예시: partyData에 다음 필드가 있다고 가정
    // {
    //   id,
    //   map,         // 큐 타입 or 맵 (ex. "소환사 협곡")
    //   people,      // 내전 인원 (ex. "5:5")
    //   ourTeam: [], // 우리 팀 정보
    //   enemyTeam: []// 상대 팀 정보
    //   ourSchool, ourDepartment,
    //   enemySchool, enemyDepartment,
    //   ...
    // }
    const {
        map = '무작위',
        people = '5:5',
        ourSchool = '우리대학교',
        ourDepartment = '우리학과',
        enemySchool = '상대대학교',
        enemyDepartment = '상대학과',
        ourTeam = [
            {
                id: 1,
                name: "롤10년차고인물",
                tag: "1234",
                avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1111.png',
                position: "top",
                tier: "emerald",
                score: 1,
                champions: ['Amumu', 'LeeSin', 'Graves'],
            },
            {
                id: 2,
                name: "듀오장인티모",
                tag: "5678",
                avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1234.png',
                position: "jungle",
                tier: "platinum",
                score: 3,
                champions: ['Garen', 'Darius', 'Riven'],
            },
            {
                id: 3,
                name: "팀랭마스터",
                tag: "8765",
                avatarUrl: "https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/5678.png",
                position: "mid",
                tier: "emerald",
                score: 3,
                champions: ['Zed', 'Ahri', 'Lux'],
            },
            {
                id: 4,
                name: "정글잘함",
                tag: "1111",
                avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/4567.png',
                position: "bottom",
                tier: "gold",
                score: 2,
                champions: ['Ezreal', 'Yasuo', 'Jhin'],
            },
            {
                id: 5,
                name: "라인전고수",
                tag: "2222",
                avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon//1234.png',
                position: "support",
                tier: "diamond",
                score: 2,
                champions: ['Thresh', 'Braum', 'Leona'],
            },
        ],
        enemyTeam = [
            {
                id: 1,
                name: "롤10년차고인물",
                tag: "1234",
                avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1111.png',
                position: "top",
                tier: "emerald",
                score: 1,
                champions: ['Amumu', 'LeeSin', 'Graves'],
            },
            {
                id: 2,
                name: "듀오장인티모",
                tag: "5678",
                avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1234.png',
                position: "jungle",
                tier: "platinum",
                score: 3,
                champions: ['Garen', 'Darius', 'Riven'],
            },
            {
                id: 3,
                name: "팀랭마스터",
                tag: "8765",
                avatarUrl: "https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/5678.png",
                position: "mid",
                tier: "emerald",
                score: 3,
                champions: ['Zed', 'Ahri', 'Lux'],
            },
            {
                id: 4,
                name: "정글잘함",
                tag: "1111",
                avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/4567.png',
                position: "bottom",
                tier: "gold",
                score: 2,
                champions: ['Ezreal', 'Yasuo', 'Jhin'],
            },
            {
                id: 5,
                name: "라인전고수",
                tag: "2222",
                avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon//1234.png',
                position: "support",
                tier: "diamond",
                score: 2,
                champions: ['Thresh', 'Braum', 'Leona'],
            },
        ],
    } = partyData;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            {/* 상단 헤더 영역 */}
            <Box sx={{ backgroundColor: '#2B2C3C', px: 3, py: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* 왼쪽: 큐 타입과 내전 인원을 한 줄에 표시 */}
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize="0.75rem" color="#888">
                                맵
                            </Typography>
                            <Typography fontSize="0.75rem" color="#fff">
                                {map || ''}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize="0.75rem" color="#888">
                                내전 인원
                            </Typography>
                            <Typography fontSize="0.75rem" color="#fff">
                                {people || ''}
                            </Typography>
                        </Box>
                    </Box>

                    {/* 오른쪽: 닫기 버튼 */}
                    <IconButton onClick={handleClose} sx={{ color: '#aaa' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>


            {/* 구분선 */}
            <Box sx={{ height: '1px', backgroundColor: '#171717' }} />

            {/* 내용 영역: 좌우 패널로 구분 */}
            <DialogContent sx={{ backgroundColor: '#2B2C3C' }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* ---------------- 왼쪽 패널: 우리 팀 ---------------- */}
                    <Box sx={{ flex: 1 }}>
                        {/* 상단 제목: "우리 팀" */}
                        <Typography
                            fontSize="1rem"
                            color="#A5A5A5"
                            sx={{ textAlign: 'center', mb: 1 }}
                        >
                            우리 팀
                        </Typography>
                        {/* 학교/학과 */}
                        <Typography
                            fontSize="0.85rem"
                            color="#A5A5A5"
                            sx={{ textAlign: 'center', mb: 2 }}
                        >
                            {`${ourSchool} ${ourDepartment}`}
                        </Typography>

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
                            <Box width="10%" textAlign="center">
                                포지션
                            </Box>
                            <Box width="15%" textAlign="center">
                                티어
                            </Box>
                            <Box width="40%" textAlign="center">
                                모스트 챔피언
                            </Box>
                        </Box>

                        {/* 우리 팀 멤버 목록 */}
                        <Box>
                            {ourTeam.map((member, idx) => {
                                if (!member.name) return null;

                                return (
                                    <Box
                                        key={idx}
                                        display="flex"
                                        alignItems="center"
                                        px={1.5}
                                        py={0.5}
                                        borderTop="1px solid #393946"
                                    >
                                        {/* 소환사 이름 */}
                                        <Box width="30%" display="flex" alignItems="center" gap={1}>
                                            <SummonerInfo
                                                name={member.name}
                                                avatarUrl={member.avatarUrl}
                                                tag={member.tag}
                                                copyable
                                            />
                                        </Box>

                                        {/* 포지션 */}
                                        <Box width="10%" textAlign="center">
                                            <PositionIcon position={member.position} />
                                        </Box>

                                        {/* 티어 */}
                                        <Box width="15%" textAlign="center">
                                            {member.tier ? (
                                                <TierBadge tier={member.tier} score={member.score} />
                                            ) : (
                                                <TierBadge tier="unrank" />
                                            )}
                                        </Box>

                                        {/* 모스트 챔피언 */}
                                        <Box width="40%" display="flex" justifyContent="center">
                                            <ChampionIconList championNames={member.champions || []} />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* ---------------- 오른쪽 패널: 상대 팀 ---------------- */}
                    <Box sx={{ flex: 1 }}>
                        {/* 상단 제목: "상대 팀" */}
                        <Typography
                            fontSize="1rem"
                            color="#A5A5A5"
                            sx={{ textAlign: 'center', mb: 1 }}
                        >
                            상대 팀
                        </Typography>
                        {/* 학교/학과 */}
                        <Typography
                            fontSize="0.85rem"
                            color="#A5A5A5"
                            sx={{ textAlign: 'center', mb: 2 }}
                        >
                            {`${enemySchool} ${enemyDepartment}`}
                        </Typography>

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
                            <Box width="10%" textAlign="center">
                                포지션
                            </Box>
                            <Box width="15%" textAlign="center">
                                티어
                            </Box>
                            <Box width="40%" textAlign="center">
                                모스트 챔피언
                            </Box>
                        </Box>

                        {/* 상대 팀 멤버 목록 */}
                        <Box>
                            {enemyTeam.map((member, idx) => {
                                if (!member.name) return null;

                                return (
                                    <Box
                                        key={idx}
                                        display="flex"
                                        alignItems="center"
                                        px={1.5}
                                        py={0.5}
                                        borderTop="1px solid #393946"
                                    >
                                        {/* 소환사 이름 */}
                                        <Box width="30%" display="flex" alignItems="center" gap={1}>
                                            <SummonerInfo
                                                name={member.name}
                                                avatarUrl={member.avatarUrl}
                                                tag={member.tag}
                                                copyable
                                            />
                                        </Box>

                                        {/* 포지션 */}
                                        <Box width="10%" textAlign="center">
                                            <PositionIcon position={member.position} />
                                        </Box>

                                        {/* 티어 */}
                                        <Box width="15%" textAlign="center">
                                            {member.tier ? (
                                                <TierBadge tier={member.tier} score={member.score} />
                                            ) : (
                                                <TierBadge tier="unrank" />
                                            )}
                                        </Box>

                                        {/* 모스트 챔피언 */}
                                        <Box width="40%" display="flex" justifyContent="center">
                                            <ChampionIconList championNames={member.champions || []} />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

