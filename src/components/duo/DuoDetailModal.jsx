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
import RefreshIcon from '@mui/icons-material/Refresh';

import SummonerInfo from '../SummonerInfo';
import TierBadge from '../TierBadge';
import ChampionIconList from '../champion/ChampionIconList';
import PositionIcon from '../PositionIcon';

// searchDummy 데이터를 그대로 사용
import matches from '/src/data/searchDummy';

/**
 * 듀오 상세 정보 모달창
 *
 * @param {boolean} open         - 모달 열림 여부
 * @param {function} handleClose - 닫기 버튼 이벤트
 * @param {object} partyData     - 듀오(또는 파티)에 대한 주요 정보 (map, people, university, department, message 등)
 * @param {Array} members        - 파티 멤버 목록
 */
export default function DuoDetailModal({
    open,
    handleClose,
    partyData,
    members = [],
}) {
    // partyData가 없으면 null 리턴
    if (!partyData) return null;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            {/* 상단 헤더 영역 */}
            <Box sx={{ backgroundColor: '#2B2C3C', pl: 3, pr: 3, pt: 2, pb: 1 }}>
                {/* 헤더 (맵 / 내전 인원 / 닫기) */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* 왼쪽: 맵 */}
                    <Box display="flex" alignItems="center" gap={1} mr={3}>
                        <Typography fontSize="0.75rem" color="#888">맵</Typography>
                        <Typography fontSize="0.75rem" color="#fff">
                            {partyData.map || ''}
                        </Typography>
                    </Box>
                    {/* 오른쪽: 인원 */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontSize="0.75rem" color="#888">내전 인원</Typography>
                        <Typography fontSize="0.75rem" color="#fff">
                            {partyData.people || ''}
                        </Typography>
                    </Box>

                    {/* 닫기 버튼 */}
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ color: '#aaa' }} />
                    </IconButton>
                </Box>
            </Box>

            {/* 콘텐츠 영역: 좌우 패널을 gap으로 띄움 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#2B2C3C',
                    gap: 3,
                    p: 2,
                }}
            >
                {/* 왼쪽 패널 */}
                <Box sx={{ flex: 1 }}>
                    <DialogContent sx={{ backgroundColor: '#2B2C3C', p: 0 }}>
                        {/* 학교/학과, 메시지 */}
                        <Box textAlign="center" mb={2}>
                            <Typography fontSize="1rem" color="#A5A5A5" sx={{ mb: 2 }}>
                                {`${partyData.university || ''} ${partyData.department || ''}`}
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: '#424254',
                                    p: 1,
                                    borderRadius: 0.8,
                                    color: '#fff',
                                    fontSize: '0.85rem',
                                    lineHeight: 1.4,
                                    textAlign: 'left',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'normal',
                                    maxHeight: '3.6em',
                                }}
                            >
                                {partyData.message}
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
                            <Box width="15%" textAlign="center">티어</Box>
                            <Box width="40%" textAlign="center">모스트 챔피언</Box>
                            <Box width="8%" textAlign="center">포지션</Box>
                        </Box>

                        {/* 멤버 리스트 */}
                        <Box>
                            {members.map((member, i) => {
                                if (!member.name) return null;

                                // 작성자(글쓴이) 여부 판단
                                const isAuthor =
                                    partyData.name === member.name &&
                                    partyData.tag === member.tag;

                                return (
                                    <Box
                                        key={i}
                                        display="flex"
                                        alignItems="center"
                                        px={1.5}
                                        py={0.5}
                                        borderTop="1px solid #393946"
                                    >
                                        {/* 소환사 이름 영역 */}
                                        <Box width="30%" display="flex" alignItems="center" gap={1}>
                                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                <SummonerInfo
                                                    name={member.name}
                                                    avatarUrl={member.avatarUrl}
                                                    tag={member.tag}
                                                    copyable
                                                />
                                                {/* 작성자일 경우만 별(*) 표시 */}
                                                {isAuthor && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            transform: 'translate(-30%, -30%)',
                                                            color: '#42E6B5',
                                                            fontSize: '1.2rem',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        *
                                                    </Box>
                                                )}
                                            </Box>
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

                                        {/* 포지션 */}
                                        <Box width="8%" textAlign="center">
                                            <PositionIcon position={member.position} />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </DialogContent>
                </Box>

                {/* 오른쪽 패널 */}
                <Box sx={{ flex: 1 }}>
                    <DialogContent
                        sx={{
                            maxHeight: '55vh',
                            overflowY: 'auto',
                            backgroundColor: '#2B2C3C',
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
                        {matches.map((match, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    borderRadius: 0.8,
                                    backgroundColor: match.resultColor,
                                    display: 'grid',
                                    gridTemplateColumns: '13% 15% 15% 17% 10% 1fr',
                                    alignItems: 'center',
                                    columnGap: 1,
                                }}
                            >
                                {/* 승/패 & 큐타입 & 시간 & 날짜 */}
                                <Box>
                                    <Typography
                                        fontWeight="bold"
                                        fontSize={16}
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

                                {/* 챔피언 아이콘 & 레벨 */}
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
                                    {match.kda.split(' / ').map((val, i, arr) => (
                                        <span key={i}>
                                            <span style={{ color: i === 1 ? 'red' : 'white' }}>
                                                {val}
                                            </span>
                                            {i < arr.length - 1 && (
                                                <span style={{ color: 'white' }}> / </span>
                                            )}
                                        </span>
                                    ))}
                                </Typography>

                                {/* 스펠 & 룬 아이콘 */}
                                <Box display="flex" flexDirection="column" gap={0.5}>
                                    <Box display="flex">
                                        {match.spells.map((url, i) => (
                                            <Avatar
                                                key={i}
                                                src={url}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    mr: 0.5,
                                                    borderRadius: 0.5,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Box display="flex">
                                        {match.perks.map((url, i) => (
                                            <Avatar
                                                key={i}
                                                src={url}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    mr: 0.5,
                                                    borderRadius: 0.5,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                {/* 아이템 아이콘 */}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 24px)',
                                        gap: '4px',
                                    }}
                                >
                                    {match.items.map((url, i) => (
                                        <Avatar
                                            key={i}
                                            src={url}
                                            sx={{ width: 24, height: 24, borderRadius: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </DialogContent>

                    {/* 전적 갱신 버튼 */}
                    <Box sx={{ backgroundColor: '#31313C' }}>
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon sx={{ color: '#fff' }} />}
                            fullWidth
                            sx={{
                                backgroundColor: '#65c7a3',
                                borderTopLeftRadius: '0px',
                                borderTopRightRadius: '0px',
                                borderBottomLeftRadius: '8px',
                                borderBottomRightRadius: '8px',
                                py: 1.2,
                                '&:hover': { backgroundColor: '#57b294' },
                            }}
                        >
                            <Typography fontSize={16} fontWeight="bold" color="#fff">
                                전적 갱신
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}
