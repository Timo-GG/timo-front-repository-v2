import React, {useState} from 'react';
import {
    Box,
    MenuItem,
    TextField,
    Divider,
    InputBase,
    Select,
    IconButton,
    Dialog,
    DialogContent,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import title from '../../public/assets/title.png';
import character from '../../public/assets/character.png';
import MatchHistoryModal from '../components/MatchHistoryModal';
import {fetchRecentMatchFull} from '../apis/accountAPI';
import { CircularProgress } from '@mui/material';

export default function MainPage() {
    const [region, setRegion] = useState('KR');
    const [searchText, setSearchText] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // 에러 상태 추가

    const handleSearch = async () => {
        if (!searchText.trim()) return;

        const [gameName, tagLine] = searchText.split('#');
        if (!gameName || !tagLine) {
            setError('올바른 형식으로 입력하세요 (예: 플레이어이름#KR1)');
            return;
        }

        setLoading(true);
        setError(''); // 에러 초기화
        try {
            const data = await fetchRecentMatchFull(gameName, tagLine);
            setMatchData(data);
            setOpenModal(true);
        } catch (error) {
            console.error('전적 조회 실패:', error);
            setError('소환사 정보를 찾을 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            backgroundColor: '#12121a',
            minHeight: '100vh',
            pt: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <img src={title} alt="TIMO.GG title"
                 style={{width: 420, maxWidth: '80vw', height: 'auto', marginBottom: 32}}/>

            <Box sx={{
                backgroundColor: '#fff',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                height: 48,
                width: 480,
                maxWidth: '90vw',
                mb: 2, // 에러 메시지 공간을 위해 줄임
                pl: 2,
                pr: 2
            }}>
                <Select value={region} onChange={(e) => setRegion(e.target.value)} variant="standard" disableUnderline
                        sx={{
                            fontWeight: 'bold',
                            color: 'black',
                            alignItems: 'center',
                            height: '100%',
                            minWidth: 40,
                            '& .MuiSelect-icon': {color: '#000000'}
                        }}>
                    <MenuItem value="KR">KR</MenuItem>
                    <MenuItem value="NA">NA</MenuItem>
                    <MenuItem value="EU">EU</MenuItem>
                </Select>

                <Divider orientation="vertical" flexItem sx={{mx: 2, borderColor: '#ddd'}}/>

                <InputBase
                    placeholder="플레이어 이름 + #KR1로 검색"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        if (error) setError(''); // 입력 시 에러 메시지 제거
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    sx={{flex: 1, color: '#333'}}
                />

                <IconButton onClick={handleSearch}>
                    <SearchIcon sx={{color: '#000'}}/>
                </IconButton>
            </Box>

            {/* 에러 메시지 표시 */}
            {error && (
                <Box sx={{
                    color: '#ff6b6b',
                    mb: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    padding: '8px 16px',
                    borderRadius: 1,
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    width: 480,
                    maxWidth: '90vw'
                }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {error}
                    </Typography>
                </Box>
            )}

            {loading && (
                <Box sx={{ mb: 8 }}>
                    <CircularProgress color="inherit" />
                </Box>
            )}

            <img src={character} alt="Timo Character" style={{height: 337, maxHeight: '60vh', width: 'auto'}}/>

            {matchData && (
                <MatchHistoryModal open={openModal} onClose={() => setOpenModal(false)} matchData={matchData}/>
            )}
        </Box>
    );
}
