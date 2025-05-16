/** 랭킹 페이지 내 정보 수정하기 모달창 */

import React, {useState} from 'react';
import {
    Dialog, Button, Typography, Box,
    TextField, List, ListItem, Paper, ListItemText, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SummonerInfo from '../SummonerInfo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PositionFilterBar from '../duo/PositionFilterBar';
import {updateRankingInfo} from '/src/apis/rankAPI';
import {schoolDepartmentsJson} from '../../data/schoolDepartmentsJson.cleaned';
import useAuthStore from '/src/storage/useAuthStore';
import {getMyInfo} from '/src/apis/authAPI';


const POSITION_LIST = ['nothing', 'top', 'jungle', 'mid', 'bottom', 'support'];

export default function EditProfileModal({open, handleClose, userProfileData}) {
    const [position, setPosition] = useState('top');
    const [department, setDepartment] = useState('');
    const [searchDept, setSearchDept] = useState('');
    const [deptList, setDeptList] = useState([]);
    const [filteredDepts, setFilteredDepts] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const [selectedGender, setSelectedGender] = useState('비밀');
    const [selectedMbti, setSelectedMbti] = useState([]);
    const [memo, setMemo] = useState('');
    const { setUserData } = useAuthStore();


    React.useEffect(() => {
        if (open && userProfileData) {
            // 포지션, MBTI, 메모 세팅
            setPosition(userProfileData.position?.toLowerCase() || 'top');
            setSelectedMbti(userProfileData.mbti ? userProfileData.mbti.split('') : []);
            setMemo(userProfileData.memo || '');
            setSelectedGender({
                MALE: '남자',
                FEMALE: '여자',
                SECRET: '비밀'
            }[userProfileData.gender] || '비밀');

            // 학과 리스트 세팅
            const univ = userProfileData.university
                || userProfileData.certifiedUnivInfo?.univName;
            if (univ && schoolDepartmentsJson[univ]) {
                setDeptList(schoolDepartmentsJson[univ]);
                // 기존 학과가 있으면 searchDept에도 표시
                setDepartment(userProfileData.department || '');
                setSearchDept(userProfileData.department || '');
            } else {
                setDeptList([]);
                setDepartment('');
                setSearchDept('');
            }
            setFilteredDepts([]);
            setFocusedIndex(-1);
        }
    }, [open, userProfileData]);

    React.useEffect(() => {
        if (!searchDept) {
            setFilteredDepts([]);
            return;
        }
        const results = deptList.filter(d =>
            d.toLowerCase().includes(searchDept.toLowerCase())
        );
        setFilteredDepts(results);
        setFocusedIndex(-1);
    }, [searchDept, deptList]);

    const handleDeptKeyDown = e => {
        if (e.key === 'ArrowDown') {
            setFocusedIndex(i => Math.min(i + 1, filteredDepts.length - 1));
        } else if (e.key === 'ArrowUp') {
            setFocusedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
            const sel = filteredDepts[focusedIndex];
            setDepartment(sel);
            setSearchDept(sel);
            setFilteredDepts([]);
            setFocusedIndex(-1);
            e.preventDefault();
        }
    };

    const toggleMbti = (type) => {
        const groupMap = {
            E: ['E', 'I'],
            I: ['E', 'I'],
            N: ['N', 'S'],
            S: ['N', 'S'],
            F: ['F', 'T'],
            T: ['F', 'T'],
            P: ['P', 'J'],
            J: ['P', 'J']
        };
        const group = groupMap[type];
        const updated = selectedMbti.filter((t) => !group.includes(t));
        setSelectedMbti([...updated, type]);
    };

    const handleSubmit = async () => {
        try {
            const mbtiString = [
                selectedMbti.find((t) => t === 'E' || t === 'I') || '',
                selectedMbti.find((t) => t === 'N' || t === 'S') || '',
                selectedMbti.find((t) => t === 'F' || t === 'T') || '',
                selectedMbti.find((t) => t === 'P' || t === 'J') || '',
            ].join('');
            const genderMap = {남자: 'MALE', 여자: 'FEMALE', 비밀: 'SECRET'};

            const dto = {
                position: position.toUpperCase(),
                ...(department && {department}),        // 학과 정보가 있을 때만
                gender: genderMap[selectedGender],
                mbti: mbtiString,
                memo,
            };

            await updateRankingInfo(dto);
            const updated = await getMyInfo(); // 서버에서 최신 정보 불러오기
            setUserData(updated);

            alert('정보가 성공적으로 수정되었습니다.');
            handleClose();
        } catch (error) {
            console.error(error);
            alert('수정에 실패했습니다.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box sx={{backgroundColor: '#31313D', p: 2,}}>
                {/* 헤더 */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                     <SummonerInfo
                       name={userProfileData?.gameName || ''}
                       tag={userProfileData?.tagLine || ''}
                      avatarUrl={userProfileData?.profileIconUrl || '/assets/default.png'}
                       />
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon sx={{color: '#fff'}}/>
                    </IconButton>
                </Box>

                <Box sx={{my: 2, height: '1px', backgroundColor: '#171717'}}/>

                <Typography mb={1} color="#fff" fontSize="1rem">내 정보</Typography>

                <Box display="flex" gap={3}>
                    {/* 왼쪽 영역 */}
                    <Box flex={1}>
                        <Typography mb={0.5} color="#aaa" sx={{
                            fontSize: '0.8rem',
                        }}>주 포지션</Typography>
                        <Box display="flex" gap={1} mb={2}>
                            <PositionFilterBar
                                positionFilter={position}
                                onPositionClick={setPosition}
                                selectedColor="#42E6B5"
                                unselectedColor="#31313D"
                                hoverColor="#42E6B5"
                                iconSize={26}
                                iconInvert={true}
                            />
                        </Box>

                        <Typography mb={0.5} color="#aaa" fontSize="0.8rem">학과</Typography>
                        <Box sx={{position: 'relative', mb: 2}}>
                            <TextField
                                fullWidth size="small"
                                placeholder="학과명을 입력하세요"
                                value={searchDept}
                                onChange={e => {
                                    setSearchDept(e.target.value);
                                    setDepartment('');
                                }}
                                onKeyDown={handleDeptKeyDown}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{mr: 1, color: '#888'}}/>
                                }}
                                sx={{
                                    backgroundColor: '#2A2B31',
                                    '& .MuiOutlinedInput-root fieldset': {
                                        borderColor: '#424254', borderRadius: '6px'
                                    },
                                    input: {color: '#fff'}
                                }}
                            />
                            {filteredDepts.length > 0 && searchDept !== department && (
                                <Paper sx={{
                                    position: 'absolute', top: '100%', left: 0, right: 0,
                                    bgcolor: '#2A2B31', border: '1px solid #424254',
                                    zIndex: 10, maxHeight: 180, overflowY: 'auto'
                                }}>
                                    <List dense>
                                        {filteredDepts.map((d, i) => (
                                            <ListItem
                                                key={d}
                                                selected={i === focusedIndex}
                                                onMouseEnter={() => setFocusedIndex(i)}
                                                onClick={() => {
                                                    setDepartment(d);
                                                    setSearchDept(d);
                                                    setFilteredDepts([]);
                                                    setFocusedIndex(-1);
                                                }}
                                                sx={{
                                                    bgcolor: i === focusedIndex ? '#42E6B5' : 'inherit',
                                                    color: i === focusedIndex ? '#000' : '#fff',
                                                    px: 2, py: 1
                                                }}
                                            >
                                                <ListItemText primary={d}/>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </Box>

                        <Typography mb={0.5} color="#aaa" sx={{
                            fontSize: '0.8rem',
                        }}>성별</Typography>
                        <Box display="flex" justifyContent="space-between" p={0.5} borderRadius={1} bgcolor="#424254"
                             mb={2}>
                            {['남자', '여자', '비밀'].map((g) => (
                                <Box
                                    key={g}
                                    onClick={() => setSelectedGender(g)}
                                    sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        py: 1,
                                        cursor: 'pointer',
                                        borderRadius: 1,
                                        fontSize: '0.85rem',
                                        color: selectedGender === g ? '#fff' : '#888',
                                        fontWeight: selectedGender === g ? 'bold' : 'normal',
                                        backgroundColor: selectedGender === g ? '#42E6B5' : 'transparent',
                                    }}
                                >
                                    {g}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* 오른쪽 영역 (MBTI) */}
                    <Box flex={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography color="#aaa" fontSize="0.8rem">MBTI</Typography>
                            <Box display="flex" alignItems="center">
                                <Typography color="#aaa" fontSize="0.8rem">초기화</Typography>
                                <IconButton size="small" onClick={() => setSelectedMbti([])}>
                                    <RestartAltIcon sx={{color: '#7B7B8E', fontSize: 18}}/>
                                </IconButton>
                            </Box>
                        </Box>

                        {/* MBTI 설명 위 */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(4, 1fr)"
                            gap={0.5}
                            fontSize="0.7rem"
                            color="#888"
                            textAlign="center"
                            mb={0.5}
                        >
                            {['외향', '직관', '감성', '탐색'].map((label, i) => (
                                <Typography key={i} sx={{
                                    fontSize: '0.7rem',
                                    color: '#888',
                                    lineHeight: 1.2,
                                }}>{label}</Typography>
                            ))}
                        </Box>

                        {/* MBTI 버튼 */}
                        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" rowGap={1} mb={0.5}>
                            {['E', 'N', 'F', 'P', 'I', 'S', 'T', 'J'].map((type) => (
                                <Button
                                    key={type}
                                    onClick={() => toggleMbti(type)}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        bgcolor: selectedMbti.includes(type) ? '#42E6B5' : '#2A2B31',
                                        color: selectedMbti.includes(type) ? '#fff' : '#B7B7C9',
                                        borderRadius: 0.5,
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        mx: 'auto',
                                        minWidth: 0,
                                        p: 0,
                                    }}
                                >
                                    {type}
                                </Button>
                            ))}
                        </Box>

                        {/* MBTI 설명 아래 */}
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(4, 1fr)"
                            gap={0.5}
                            fontSize="0.7rem"
                            color="#888"
                            textAlign="center"
                        >
                            {['내향', '현실', '이성', '계획'].map((label, i) => (
                                <Typography key={i}
                                            sx={{
                                                fontSize: '0.7rem',
                                                color: '#888',
                                                lineHeight: 1.2,
                                            }}>{label}</Typography>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* 메모 */}
                <Typography mt={2} mb={0.5} color="#aaa" sx={{
                    fontSize: '0.8rem',
                }}>메모</Typography>
                <TextField
                    fullWidth
                    size="small"
                    rows={1}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    sx={{
                        bgcolor: '#424254',
                        color: '#fff',
                        borderRadius: 1,
                        input: {color: '#fff'},
                        fontSize: '0.8rem',
                    }}
                />

                {/* 버튼 */}
                <Box display="flex" gap={1.5} mt={3}>
                    <Button fullWidth onClick={handleClose} size="small" sx={{
                        bgcolor: '#2A2B31', color: '#fff', fontWeight: 'bold',
                        height: 42,
                        fontSize: '1rem',
                    }}>
                        취소
                    </Button>
                    <Button fullWidth onClick={handleSubmit} size="small" sx={{
                        bgcolor: '#42E6B5', color: '#fff', fontWeight: 'bold',
                        height: 42,
                        fontSize: '1rem',
                    }}>
                        등록
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
