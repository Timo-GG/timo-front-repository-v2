/** 내전 파티 생성하기 모달창 */

import React, { useState, useEffect } from 'react';
import {
    Dialog, Box, Typography, TextField, Select, MenuItem,
    Button, IconButton, Avatar, useTheme, useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SummonerInfo from '../SummonerInfo';
import TierBadge from '../TierBadge';
import PositionFilterBar from '/src/components/duo/PositionFilterBar';
import ChampionIconList from '../champion/ChampionIconList';
import useAuthStore from "../../storage/useAuthStore.jsx";
import {fetchCompactPlayerHistory} from "../../apis/compactPlayerHistory.js";
import {createScrimBoard, updateScrimBoard} from "../../apis/redisAPI.js";

const defaultMember = {
    gameName: '',
    tagLine: '',
    profileUrl: 'default.png',
    rankInfo: {
        tier: '',
        rank: '',
        lp: 0,
        wins: 0,
        losses: 0,
    },
    most3Champ: [],
    myPosition: 'NOTHING',
};

export default function CreateScrimModal({ open, handleClose, onCreateScrim, currentTab, onUpdateScrim, editScrim }) {
    const [memo, setMemo] = useState('');
    const [map, setMap] = useState('소환사 협곡');
    const [people, setPeople] = useState('5:5');
    const [myPosition, setMyPosition] = useState('nothing');
    const [partyMembers, setPartyMembers] = useState([]);
    const [errors, setErrors] = useState({});
    const [summonerInputs, setSummonerInputs] = useState([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { userData: me } = useAuthStore();
    const riot = me?.riotAccount;

    useEffect(() => {
        if (editScrim) {
            setMemo(editScrim.message);
            setMap(editScrim.queueType);
            setPeople(`${editScrim.headCount}:${editScrim.headCount}`);
            setMyPosition(editScrim.party?.[0]?.myPosition?.toLowerCase() || 'nothing');
            setPartyMembers(editScrim.party?.slice(1) || []);
            setSummonerInputs(editScrim.party?.slice(1).map(() => "") || []);
        }
    }, [editScrim]);

    useEffect(() => {
        const limit = people === '3:3' ? 2 : 4;
        if (!editScrim) {
            setPartyMembers(Array(limit).fill({ ...defaultMember }));
            setSummonerInputs(Array(limit).fill(""));
        }
    }, [people]);

    console.log(partyMembers);

    // 팀원 정보 입력값 검증 및 등록 (형식: "소환사이름#태그")
    const handleVerifySummoner = async (index) => {
        const input = summonerInputs[index];
        if (!input.includes('#')) return setErrors(prev => ({ ...prev, [index]: '형식 오류' }));
        const [gameName, tagLine] = input.split('#');
        try {
            const { avatarUrl, rankInfo, most3Champ } = await fetchCompactPlayerHistory({ gameName, tagLine });
            const updated = [...partyMembers];
            updated[index] = {
                gameName,
                tagLine,
                profileUrl: avatarUrl || 'default.png',
                rankInfo,
                most3Champ,
                myPosition: 'NOTHING'
            };
            setPartyMembers(updated);
            const updatedInputs = [...summonerInputs];
            updatedInputs[index] = '';
            setSummonerInputs(updatedInputs);
        } catch {
            setErrors(prev => ({ ...prev, [index]: '불러오기 실패' }));
        }
    };

    // 등록 or 수정 버튼 클릭
    const handleSubmit = async () => {
        const mapCode = map === '소환사 협곡' ? 'RIFT' : 'ABYSS';
        const headCount = people === '3:3' ? 3 : 5;
        const gameName = riot?.accountName || '';
        const tagLine = riot?.accountTag || '';

        try {
            // 작성자 정보 최신화
            const { avatarUrl, rankInfo, most3Champ } = await fetchCompactPlayerHistory({ gameName, tagLine });

            const author = {
                gameName,
                tagLine,
                profileUrl: avatarUrl || '/default.png',
                rankInfo: {
                    tier: rankInfo?.tier || 'Unranked',
                    rank: rankInfo?.rank || '',
                    lp: rankInfo?.lp || 0,
                    wins: rankInfo?.wins || 0,
                    losses: rankInfo?.losses || 0
                },
                most3Champ: most3Champ || [],
                myPosition: myPosition?.toUpperCase() || 'NOTHING'
            };

            const formattedMembers = partyMembers.slice(0, headCount - 1).map(m => ({
                gameName: m.gameName,
                tagLine: m.tagLine,
                profileUrl: m.profileUrl || '/default.png',
                rankInfo: {
                    tier: m?.tier || 'Unranked',
                    rank: m?.rank || '',
                    lp: m?.lp || 0,
                    wins: m?.wins || 0,
                    losses: m?.losses || 0,
                },
                most3Champ: m.champions || [],
                myPosition: m.myPosition?.toUpperCase() || 'NOTHING'
            }));

            const requestBody = {
                ...(editScrim ? { boardUUID: editScrim.id } : { memberId: me?.memberId }),
                mapCode,
                memo,
                headCount,
                partyInfo: [author, ...formattedMembers]
            };

            const res = editScrim
                ? await updateScrimBoard(requestBody)
                : await createScrimBoard(requestBody);

            const formatted = transformScrimForFrontend(res.data);
            editScrim ? onUpdateScrim?.(formatted) : onCreateScrim?.(formatted);;
            handleClose();
        } catch (e) {
            console.error('스크림 요청 처리 실패:', e);
        }
    };

    const transformScrimForFrontend = (data) => {
        const author = data.memberInfo;
        const riot = author?.riotAccount;

        return {
            id: data.boardUUID,
            name: riot?.gameName || '',
            tag: riot?.tagLine || '',
            avatarUrl: riot?.profileUrl || '/default.png',
            queueType: data.mapCode === 'RIFT' ? '소환사 협곡' : '칼바람 나락',
            school: author?.univName || '미인증',
            department: author?.department || '',
            message: data.memo,
            headCount: data.headCount,
            party: data.partyInfo,
            updatedAt: new Date().toISOString(), // 지금 시각
        };
    };


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <Box sx={{ backgroundColor: '#31313E', pl: 3, pr: 3, pt: 2, pb: 1 }}>
                {/* 헤더 */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="#fff" fontWeight="bold">{editScrim ? '파티 수정하기' : '파티 생성하기'}</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ color: '#aaa' }} />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ height: '1px', backgroundColor: '#171717' }} />

            <Box sx={{ backgroundColor: '#31313E', pl: 3, pr: 3, pb: 1 }}>
                {/* 메모 */}
                <TextField
                    placeholder="저희랑 내전하실 분 구해요."
                    fullWidth
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    variant="outlined"
                    sx={{
                        my: 2,
                        borderRadius: 1,
                        bgcolor: '#282830',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'transparent' },
                            '&:hover fieldset': { borderColor: 'transparent' },
                            '&.Mui-focused fieldset': { borderColor: 'transparent' }
                        },
                        input: { color: '#fff' }
                    }}
                />

                {/* 설정 영역 */}
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={isMobile ? 1.5 : 2}
                    mb={2}
                >
                    {/* 포지션 */}
                    <Box display="flex" flexDirection="column">
                        <Typography fontSize="0.85rem" color="#aaa" mb={0.5}>나의 포지션</Typography>
                        <PositionFilterBar
                            positionFilter={myPosition}
                            onPositionClick={setMyPosition}
                            selectedColor="#42E6B5"
                            unselectedColor="#31313E"
                        />
                    </Box>

                    {/* 맵 + 인원 선택 */}
                    <Box display="flex" flexDirection="row" gap={2}>
                        {/* 맵 */}
                        <Box display="flex" flexDirection="column" flex={1}>
                            <Typography fontSize="0.85rem" color="#aaa" mb={0.5}>맵</Typography>
                            <Select
                                value={map}
                                onChange={e => setMap(e.target.value)}
                                sx={{
                                    bgcolor: '#31313D',
                                    color: '#fff',
                                    width: '100%',
                                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#424254' },
                                    '& .MuiSelect-icon': { color: '#7B7B8E' },
                                }}
                            >
                                <MenuItem value="소환사 협곡">소환사 협곡</MenuItem>
                                <MenuItem value="칼바람 나락">칼바람 나락</MenuItem>
                            </Select>
                        </Box>

                        {/* 인원 */}
                        <Box display="flex" flexDirection="column" flex={1}>
                            <Typography fontSize="0.85rem" color="#aaa" mb={0.5}>인원</Typography>
                            <Select
                                value={people}
                                onChange={e => setPeople(e.target.value)}
                                sx={{
                                    bgcolor: '#31313D',
                                    color: '#fff',
                                    width: '100%',
                                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#424254' },
                                    '& .MuiSelect-icon': { color: '#7B7B8E' },
                                }}
                            >
                                <MenuItem value="5:5">5 : 5</MenuItem>
                                <MenuItem value="3:3">3 : 3</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                </Box>



                <Box sx={{ overflowX: 'auto' }}>
                    {/* 테이블 전체를 감싸는 래퍼 */}
                    <Box minWidth="720px">

                        {/* 멤버 입력 테이블 헤더 */}
                        <Box display="flex" alignItems="center" px={1.5} py={1} color="#888" fontSize="0.85rem"
                             sx={{ backgroundColor: "#28282F" }}>
                            <Box width="25%">소환사 이름</Box>
                            <Box width="10%" textAlign="center">티어</Box>
                            <Box width="20%" textAlign="center">모스트 챔피언</Box>
                            <Box width="45%" textAlign="center">포지션</Box>
                        </Box>

                        {/* 각 멤버 슬롯 렌더링 */}
                        {partyMembers.map((member, i) => (
                            <Box key={i} display="flex" alignItems="center" px={1.5} py={1.2} borderTop="1px solid #393946">
                                <Box width="25%" display="flex" alignItems="center" gap={1}>
                                    {member.gameName ? (
                                        <>
                                            <Avatar src={member.profileUrl} sx={{ width: 32, height: 32 }} />
                                            <Box>
                                                <Typography fontSize="0.9rem" color="#fff">{member.gameName}</Typography>
                                                <Typography fontSize="0.75rem" color="#888">#{member.tagLine}</Typography>
                                            </Box>
                                        </>
                                    ) : (
                                        <Box sx={{ display: 'flex', height: '40px', width: '100%' }}>
                                            <TextField
                                                fullWidth
                                                placeholder="소환사 이름#태그"
                                                variant="outlined"
                                                value={summonerInputs[i] || ""}
                                                onChange={(e) => {
                                                    const newInputs = [...summonerInputs];
                                                    newInputs[i] = e.target.value;
                                                    setSummonerInputs(newInputs);
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '100%',
                                                        borderRadius: '10px 0 0 10px',
                                                        backgroundColor: theme.palette.background.input,
                                                        border: `1px solid ${theme.palette.border.main}`,
                                                        '& fieldset': { borderColor: 'transparent' },
                                                        '& input': {
                                                            color: theme.palette.text.primary,
                                                            padding: '10px 12px',
                                                            fontSize: '0.875rem',
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                onClick={() => handleVerifySummoner(i)}
                                                sx={{
                                                    height: '100%',
                                                    borderRadius: '0 10px 10px 0',
                                                    backgroundColor: theme.palette.background.input,
                                                    color: theme.palette.text.secondary,
                                                    border: `1px solid ${theme.palette.border.main}`,
                                                    borderLeft: 'none',
                                                    px: 2,
                                                    minWidth: '64px',
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                등록
                                            </Button>
                                        </Box>
                                    )}
                                </Box>

                                <Box width="10%" textAlign="center">
                                    <TierBadge
                                        tier={(member.rankInfo?.tier || 'unrank').toLowerCase()}
                                        score={member.rankInfo?.lp || 0}
                                        rank={member.rankInfo?.rank}
                                    />
                                </Box>

                                <Box width="20%" display="flex" justifyContent="center">
                                    <ChampionIconList championNames={member.most3Champ || []} />
                                </Box>

                                <Box width="45%" display="flex" justifyContent="space-between" alignItems="center">
                                    <PositionFilterBar
                                        positionFilter={member.myPosition || 'nothing'}
                                        onPositionClick={(pos) => {
                                            const updated = [...partyMembers];
                                            updated[i] = { ...updated[i], myPosition: pos };
                                            setPartyMembers(updated);
                                        }}
                                        selectedColor="#42E6B5"
                                        unselectedColor="#31313E"
                                    />
                                    {member.gameName && (
                                        <Button
                                            onClick={() => {
                                                const updated = [...partyMembers];
                                                updated[i] = defaultMember;
                                                setPartyMembers(updated);
                                            }}
                                            sx={{
                                                ml: 1,
                                                minWidth: 0,
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                color: '#aaa',
                                                fontSize: '0.8rem',
                                                '&:hover': { backgroundColor: '#3a3a4a' }
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box display="flex" gap={2} mt={4}>
                    <Button fullWidth onClick={handleClose} sx={{
                        border: `1px solid ${theme.palette.border.main}`,
                        bgcolor: '#2A2B31', color: '#fff', height: 48, fontWeight: 'bold'
                    }}>
                        취소
                    </Button>
                    <Button fullWidth onClick={handleSubmit} sx={{ bgcolor: '#42E6B5', color: '#000', height: 48, fontWeight: 'bold' }}>
                        <Typography fontWeight="bold" color="white">{editScrim ? '수정' : '등록'}</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
