/** 내전 파티 생성하기 모달창 */

import React, { useState, useEffect } from 'react';
import {
    Dialog, Box, Typography, TextField, Select, MenuItem,
    Button, IconButton, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SummonerInfo from '../SummonerInfo';
import TierBadge from '../TierBadge';
import PositionFilterBar from '/src/components/duo/PositionFilterBar';
import ChampionIconList from '../champion/ChampionIconList';
import theme from '../../theme';

const defaultMember = {
    name: '',
    tag: '',
    tier: null,
    score: null,
    champions: [],
    position: null,
};

const dummyPartyMembers = [
    {
        name: '롤10년차고인물',
        tag: '1234',
        tier: 'emerald',
        score: 1,
        champions: ['Neeko', 'Kaisa', 'Ezreal'],
        position: 'top'
    },
    {
        name: '롤10년차고인물',
        tag: '1234',
        tier: 'emerald',
        score: 1,
        champions: ['Neeko', 'Kaisa', 'Ezreal'],
        position: 'jungle'
    },
    {},
    {}
];

export default function CreateScrimModal({ open, handleClose, onCreateScrim, currentTab }) {
    const [memo, setMemo] = useState('');
    const [map, setMap] = useState('소환사 협곡');
    const [people, setPeople] = useState('5:5');
    const [myPosition, setMyPosition] = useState('nothing');
    // partyMembers: 입력받은 나머지 멤버들 (작성자는 따로 포함)
    const [partyMembers, setPartyMembers] = useState(dummyPartyMembers);
    const [errors, setErrors] = useState({});
    // 여러 슬롯에 대해 독립적인 소환사 입력을 관리 (초기엔 5:5이면 4슬롯, 3:3이면 2슬롯)
    const initialLimit = people === '3:3' ? 2 : 4;
    const [summonerInputs, setSummonerInputs] = useState(Array(initialLimit).fill(""));
    // "대학교" / "학과"를 별도 상태로 관리
    const [university, setUniversity] = useState('');
    const [department, setDepartment] = useState('');

    // people 상태 변경 시 멤버 입력 슬롯 길이 재설정
    useEffect(() => {
        const newLimit = people === '3:3' ? 2 : 4;
        setPartyMembers(prev => prev.slice(0, newLimit));
        setSummonerInputs(Array(newLimit).fill(""));
    }, [people]);

    // 각 슬롯의 입력값 검증 및 등록 (형식: "소환사이름#태그")
    const handleVerifySummoner = (index) => {
        const input = summonerInputs[index];
        if (!input.includes('#')) {
            setErrors(prev => ({ ...prev, [index]: '형식이 올바르지 않습니다 (예: 소환사이름#태그)' }));
            return;
        }
        const [name, tag] = input.split('#');
        if (!name.trim() || !tag.trim()) {
            setErrors(prev => ({ ...prev, [index]: '형식이 올바르지 않습니다 (예: 소환사이름#태그)' }));
            return;
        }
        // 검증 성공: 더미 데이터를 생성 (실제라면 API 호출 후 결과 사용 가능)
        const dummy = {
            name: name.trim(),
            tag: tag.trim(),
            tier: 'Gold',
            score: 77,
            champions: ['Ahri', 'Jinx', 'Nautilus'],
            position: 'Mid'
        };
        const updated = [...partyMembers];
        updated[index] = dummy;
        setPartyMembers(updated);

        const updatedInputs = [...summonerInputs];
        updatedInputs[index] = "";
        setSummonerInputs(updatedInputs);
        setErrors(prev => ({ ...prev, [index]: '' }));
    };

    const partyLimit = people === '3:3' ? 2 : 4;
    const members = partyMembers.slice(0, partyLimit);

    // "등록" 버튼 클릭 시: 작성자 정보를 자동 포함하여 전체 멤버 배열(fullMembers) 구성
    const handleSubmit = () => {
        // 작성자 정보 (현재 사용자 정보; 실제 서비스에서는 context 또는 prop으로 전달)
        const author = {
            name: '롤10년차고인물',
            tag: '1234',
            avatarUrl: '/default.png',
            tier: 'Gold',   // 예시값
            score: 77,
            university: "서울과기대",
            champions: ['Ahri', 'Jinx', 'Nautilus'],
            position: myPosition  // 또는 별도로 설정된 값
        };

        // fullMembers: 작성자 + 나머지 멤버들; 3:3이면 총 3명, 5:5이면 총 5명.
        const fullMembers = [author, ...members];

        // 실제 스크림 객체에 대학/학과를 분기하여 저장
        let finalUniversity = '';
        let finalDepartment = '';

        if (currentTab === 0) {
            // 전체 대학교 탭이면 university 값을 사용
            finalUniversity = university;
            finalDepartment = ''; // 학과는 비워둠
        } else {
            // 우리 학교 탭이면 department 값을 사용
            finalUniversity = '';
            finalDepartment = department;
        }

        const newScrim = {
            id: Date.now(),
            name: author.name,
            tag: author.tag,
            avatarUrl: author.avatarUrl,
            map,
            people,
            avgTier: 'Gold',
            avgScore: 77,
            // 탭에 따라 달라진 최종값을 넣어준다
            university: finalUniversity,
            department: finalDepartment,
            message: memo,
            createdAt: new Date().toISOString(),
            members: fullMembers,
        };
        onCreateScrim(newScrim);
        handleClose();

    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <Box sx={{ backgroundColor: '#31313E', pl: 3, pr: 3, pt: 2, pb: 1 }}>
                {/* 헤더 */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize="1.1rem" fontWeight="bold" color="#fff">파티 생성하기</Typography>
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
                <Box display="flex" gap={2} alignItems="flex-end" mb={2}>
                    <Box display="flex" flexDirection="column" justifyContent="flex-end">
                        <Typography fontSize="0.85rem" color="#aaa" mb={0.5}>나의 포지션</Typography>
                        <PositionFilterBar
                            positionFilter={myPosition}
                            onPositionClick={setMyPosition}
                            selectedColor="#42E6B5"
                            unselectedColor="#31313E"
                        />
                    </Box>

                    <Select value={map} onChange={e => setMap(e.target.value)} sx={{
                        minWidth: 120,
                        bgcolor: '#31313D',
                        color: '#fff',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: '#424254' },
                        '& .MuiSelect-icon': { color: '#7B7B8E' },
                    }}>
                        <MenuItem value="소환사 협곡">소환사 협곡</MenuItem>
                        <MenuItem value="칼바람 나락">칼바람 나락</MenuItem>
                    </Select>
                    <Select value={people} onChange={e => setPeople(e.target.value)} sx={{
                        minWidth: 80,
                        bgcolor: '#31313D',
                        color: '#fff',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: '#424254' },
                        '& .MuiSelect-icon': { color: '#7B7B8E' },
                    }}>
                        <MenuItem value="5:5">5:5</MenuItem>
                        <MenuItem value="3:3">3:3</MenuItem>
                    </Select>
                    <Select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        displayEmpty
                        renderValue={
                            department !== '' ? undefined : () => <span style={{ color: '#7B7B8E' }}>학과를 선택해주세요</span>
                        }
                        sx={{
                            minWidth: 150,
                            bgcolor: '#31313D',
                            color: '#fff',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: '#424254' },
                            '& .MuiSelect-icon': { color: '#7B7B8E' },
                        }}
                    >
                        <MenuItem value="컴퓨터공학과">컴퓨터공학과</MenuItem>
                        <MenuItem value="전자공학과">전자공학과</MenuItem>
                        <MenuItem value="기계공학과">기계공학과</MenuItem>
                    </Select>
                </Box>

                {/* 멤버 입력 테이블 헤더 */}
                <Box display="flex" alignItems="center" px={1.5} py={1} color="#888" fontSize="0.85rem"
                    sx={{ backgroundColor: "#28282F" }}>
                    <Box width="25%">소환사 이름</Box>
                    <Box width="10%" textAlign="center">티어</Box>
                    <Box width="20%" textAlign="center">모스트 챔피언</Box>
                    <Box width="45%" textAlign="center">포지션</Box>
                </Box>

                {/* 각 멤버 슬롯 렌더링 */}
                {members.map((member, i) => (
                    <Box key={i} display="flex" alignItems="center" px={1.5} py={1.2} borderTop="1px solid #393946">
                        <Box width="25%" display="flex" alignItems="center" gap={1}>
                            {member.name ? (
                                <>
                                    <Avatar src="/default.png" sx={{ width: 32, height: 32 }} />
                                    <Box>
                                        <Typography fontSize="0.9rem" color="#fff">{member.name}</Typography>
                                        <Typography fontSize="0.75rem" color="#888">#{member.tag}</Typography>
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
                            {member.tier ? <TierBadge tier={member.tier} score={member.score} /> : <TierBadge tier='unrank' />}
                        </Box>

                        <Box width="20%" display="flex" justifyContent="center">
                            <ChampionIconList championNames={member.champions || []} />
                        </Box>

                        <Box width="45%" display="flex" justifyContent="space-between" alignItems="center">
                            <PositionFilterBar
                                positionFilter={member.position || 'nothing'}
                                onPositionClick={(pos) => {
                                    const updated = [...partyMembers];
                                    updated[i] = { ...updated[i], position: pos };
                                    setPartyMembers(updated);
                                }}
                                selectedColor="#42E6B5"
                                unselectedColor="#31313E"
                            />
                            {member.name && (
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

                <Box display="flex" gap={2} mt={4}>
                    <Button fullWidth onClick={handleClose} sx={{
                        border: `1px solid ${theme.palette.border.main}`,
                        bgcolor: '#2A2B31', color: '#fff', height: 48, fontWeight: 'bold'
                    }}>
                        취소
                    </Button>
                    <Button fullWidth onClick={handleSubmit} sx={{ bgcolor: '#42E6B5', color: '#000', height: 48, fontWeight: 'bold' }}>
                        <Typography fontWeight="bold" color="white">등록</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
