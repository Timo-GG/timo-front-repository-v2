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
    DialogContent
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

    const handleSearch = async () => {
        if (!searchText.trim()) return;

        const [gameName, tagLine] = searchText.split('#');
        if (!gameName || !tagLine) {
            alert('올바른 형식으로 입력하세요 (예: 플레이어이름#KR1)');
            return;
        }

        setLoading(true);  // ← 로딩 시작
        try {
            const data = await fetchRecentMatchFull(gameName, tagLine);
            setMatchData(data);
            setOpenModal(true);
        } catch (error) {
            console.error('전적 조회 실패:', error);
            alert('소환사 정보를 찾을 수 없습니다.');
        } finally {
            setLoading(false);  // ← 로딩 끝
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
                mb: 10,
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
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    sx={{flex: 1, color: '#333'}}
                />

                <IconButton onClick={handleSearch}>
                    <SearchIcon sx={{color: '#000'}}/>
                </IconButton>
            </Box>
            {loading && (
                <Box>
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
