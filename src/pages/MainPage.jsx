import React, { useState } from 'react';
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
import title from '../assets/title.png';
import character from '../assets/character.png';
import MatchHistoryModal from '../components/MatchHistoryModal';

export default function MainPage() {
  const [region, setRegion] = useState('KR');
  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    setOpenModal(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#12121a',
        minHeight: '100vh',
        pt: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <img
        src={title}
        alt="TIMO.GG title"
        style={{
          width: 420,
          maxWidth: '80vw',
          height: 'auto',
          marginBottom: 32
        }}
      />

      <Box
        sx={{
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
        }}
      >
        <Select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          variant="standard"
          disableUnderline
          sx={{
            fontWeight: 'bold',
            color: 'black',
            alignItems: 'center',
            height: '100%',
            minWidth: 40,
            '& .MuiSelect-icon': { color: '#000000' },
          }}
        >
          <MenuItem value="KR">KR</MenuItem>
          <MenuItem value="NA">NA</MenuItem>
          <MenuItem value="EU">EU</MenuItem>
        </Select>

        <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#ddd' }} />

        <InputBase
          placeholder="플레이어 이름 + #KR1로 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          sx={{ flex: 1, color: '#333' }}
        />

        <IconButton onClick={handleSearch}>
          <SearchIcon sx={{ color: '#000' }} />
        </IconButton>
      </Box>

      <img
        src={character}
        alt="Timo Character"
        style={{
          height: 337,
          maxHeight: '60vh',
          width: 'auto'
        }}
      />
      <MatchHistoryModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
}
