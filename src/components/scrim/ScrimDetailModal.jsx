/** 내전 상세정보 모달창 */

import React from 'react';
import {
    Dialog, DialogContent, Box, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TierBadge from '../TierBadge';
import ChampionIconList from '../champion/ChampionIconList';
import PositionIcon from '../PositionIcon';
import SummonerInfo from '../SummonerInfo';
// import StarIcon from '@mui/icons-material/Star'; // 별 아이콘 사용 시 import

export default function ScrimDetailModal({ open, handleClose, partyId, scrims }) {
    // scrims 배열에서 partyId에 해당하는 스크림 찾기
    const partyData = scrims?.find(item => item.id === partyId);
    if (!partyData) return null;

    // 파티의 멤버 배열 (백엔드 혹은 생성 시 newScrim.members 등에 저장된 것을 사용)
    const members = partyData.party || [];

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <Box sx={{ backgroundColor: '#2B2C3C', p: { xs: 2, sm: 3 } }}>
                {/* 헤더 */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* 왼쪽: 맵 + 내전 인원  */}
                    <Box display="flex" alignItems="center" gap={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize="0.75rem" color="#888">맵</Typography>
                            <Typography fontSize="0.75rem" color="#fff">
                                {partyData.queueType || ''}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize="0.75rem" color="#888">내전 인원</Typography>
                            <Typography fontSize="0.75rem" color="#fff">
                                {partyData.headCount ? `${partyData.headCount} : ${partyData.headCount}` : ''}
                            </Typography>
                        </Box>
                    </Box>

                    {/* 오른쪽: 닫기 버튼 */}
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ color: '#aaa' }} />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ height: '1px', backgroundColor: '#171717' }} />

            <DialogContent sx={{ backgroundColor: '#2B2C3C', p: { xs: 2, sm: 3 } }}>
                <Box textAlign="center" mb={2}>
                    <Typography fontSize={{ xs: '0.9rem', sm: '1rem' }} color="#A5A5A5" sx={{ mb: 2 }}>
                        {`${partyData.school || ''} ${partyData.department || ''}`}
                    </Typography>
                    <Box
                        sx={{
                            backgroundColor: '#424254',
                            p: { xs: 1, sm: 2 },
                            borderRadius: 0.8,
                            color: '#fff',
                            fontSize: { xs: '0.8rem', sm: '0.85rem' },
                            lineHeight: 1.4,
                            textAlign: 'left',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                            maxHeight: { xs: '3.2em', sm: '3.6em' }
                        }}
                    >
                        {partyData.message}
                    </Box>
                </Box>

                {/* 테이블 헤더 */}
                <Box sx={{ overflowX: 'auto' }}>
                    <Box sx={{ minWidth: { xs: '600px', sm: 'auto' }, width: '100%' }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            px={{ xs: 1, sm: 1.5 }}
                            py={0.5}
                            color="#888"
                            fontSize={{ xs: '0.75rem', sm: '0.85rem' }}
                            sx={{ backgroundColor: "#282830" }}
                        >
                            <Box width="30%">소환사</Box>
                            <Box width="15%" textAlign="center">티어</Box>
                            <Box width="40%" textAlign="center">모스트 챔피언</Box>
                            <Box width="8%" textAlign="center">포지션</Box>
                        </Box>

                        {/* 멤버 리스트 */}
                        <Box>
                            {members.map((member, i) => {
                                if (!member.gameName) return null;

                                // 작성자(글쓴이) 여부 판단
                                const isAuthor =
                                    partyData.name === member.gameName &&
                                    partyData.tag === member.tagLine;

                                return (
                                    <Box
                                        key={i}
                                        display="flex"
                                        alignItems="center"
                                        px={{ xs: 1, sm: 1.5 }}
                                        py={{ xs: 0.5, sm: 1 }}
                                        borderTop="1px solid #393946"
                                    >
                                        {/* 소환사 이름 영역 */}
                                        <Box width="30%" display="flex" alignItems="center" gap={1}>
                                            {/* 감싼 래퍼(Box)를 position: relative 로 설정 */}
                                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                <SummonerInfo
                                                    name={member.gameName}
                                                    avatarUrl={member.profileUrl}
                                                    tag={member.tagLine}
                                                    copyable
                                                />
                                                {/* 작성자일 경우만 별 표시 */}
                                                {isAuthor && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            // 원하는 위치 조정 (예: 살짝 더 위/왼쪽으로 옮기려면 transform 사용)
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
                                            {member.tier
                                                ? <TierBadge tier={member.tier} score={member.lp} rank={member.rank} />
                                                : <TierBadge tier='unrank' />
                                            }
                                        </Box>

                                        {/* 모스트 챔피언 */}
                                        <Box width="40%" display="flex" justifyContent="center">
                                            <ChampionIconList championNames={member.champions || []} />
                                        </Box>

                                        {/* 포지션 */}
                                        <Box width="8%" textAlign="center">
                                            <PositionIcon position={member.myPosition} />
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
