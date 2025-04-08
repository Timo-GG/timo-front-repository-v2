// src/components/ScrimDetailModal.jsx
import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, Box, Typography, Avatar,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TierBadge from './TierBadge';
import ChampionIconList from './ChampionIconList';
import PositionIcon from './PositionIcon';
import scrimMembersDummy from '../data/scrimMembersDummy';
import SummonerInfo from './SummonerInfo';
import scrimDummy from '../data/scrimDummy'; // 이미 import 했다면 생략

export default function ScrimDetailModal({ open, handleClose, partyId }) {
    const members = scrimMembersDummy[partyId] || [];
    const handleSubmit = () => {
        handleClose();
    };
    const partyData = scrimDummy.find(item => item.id === partyId);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <Box sx={{ backgroundColor: '#2B2C3C', pl: 3, pr: 3, pt: 2, pb: 1 }}>
                {/* 헤더 */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* 오른쪽 정보 영역 */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {/* 왼쪽: 맵 */}
                        <Box display="flex" alignItems="center" gap={1} mr={3}>
                            <Typography fontSize="0.75rem" color="#888">맵</Typography>
                            <Typography fontSize="0.75rem" color="#fff">{partyData?.map || ''}</Typography>
                        </Box>
                        {/* 오른쪽: 내전 인원 */}
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize="0.75rem" color="#888">내전 인원</Typography>
                            <Typography fontSize="0.75rem" color="#fff">{partyData?.peopleCount || ''}</Typography>
                        </Box>
                    </Box>

                    {/* 닫기 버튼 */}
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ color: '#aaa' }} />
                    </IconButton>
                </Box>

            </Box>
            <Box sx={{ height: '1px', backgroundColor: '#171717' }} />
            <DialogContent>
                <Box textAlign="center" mb={2}>
                    <Typography fontSize="1rem" color="#A5A5A5" sx={{ mb: 2 }}>
                        {`${partyData?.university || ''} ${partyData?.department || ''}`}
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
                            // ✨ maxHeight 명시적으로 지정 (줄 수 * lineHeight)
                            maxHeight: '3.6em', // 1.4 * 2줄
                        }}
                    >
                        {scrimDummy.find(item => item.id === partyId)?.message || ''}
                    </Box>
                </Box>
                <Box display="flex" alignItems="center" px={1.5} py={0.5} color="#888" fontSize="0.85rem">
                    <Box width="30%">소환사 이름</Box>
                    <Box width="15%" textAlign="center">티어</Box>
                    <Box width="40%" textAlign="center">모스트 챔피언</Box>
                    <Box width="8%" textAlign="center">포지션</Box>
                </Box>
                <Box>
                    {members.map((member, i) => member.name && (
                        <Box
                            key={i}
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

                            {/* 티어 */}
                            <Box width="15%" textAlign="center">
                                {member.tier ? <TierBadge tier={member.tier} score={member.score} /> : <TierBadge tier='unrank' />}
                            </Box>

                            {/* 모스트 챔피언 */}
                            <Box width="40%" display="flex" justifyContent="center">
                                <ChampionIconList championNames={member.champions || []} />
                            </Box>

                            {/* 포지션 */}
                            <Box width="5%" display="flex" justifyContent="space-between" alignItems="center">
                                <PositionIcon position={member.position} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
