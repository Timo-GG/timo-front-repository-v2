import React from 'react';
import {
  Box,
  MenuItem,
  TextField,
  Divider,
  InputBase,
  Select,
} from '@mui/material';
import title from '../assets/title.png';
import character from '../assets/character.png';

export default function MainPage() {
  const [region, setRegion] = React.useState('KR');

  return (
    <Box
      sx={{
        backgroundColor: '#12121a',
        minHeight: '100vh',
        pt: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* 타이틀 이미지 */}
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

      {/* 검색창 컨테이너 */}
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
        {/* 왼쪽 Select */}
        <Select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          variant="standard"
          disableUnderline
          sx={{
            fontWeight: 'bold',
            color: "black",
            alignItems: 'center', // ⬅️ 수직 가운데 정렬
            height: '100%',       // ⬅️ 부모 Box의 높이에 맞추기
            minWidth: 40,
            '& .MuiSelect-icon': { color: '#000000' },
          }}
        >
          <MenuItem value="KR">KR</MenuItem>
          <MenuItem value="NA">NA</MenuItem>
          <MenuItem value="EU">EU</MenuItem>
        </Select>

        {/* 구분선 */}
        <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#ddd' }} />

        {/* 오른쪽 입력창 */}
        <InputBase
          placeholder="플레이어 이름 + #KR1로 검색"
          sx={{ flex: 1, color: '#333' }}
        />
      </Box>

      {/* 캐릭터 이미지 */}
      <img
        src={character}
        alt="Timo Character"
        style={{
          height: 337,
          maxHeight: '60vh',
          width: 'auto'
        }}
      />
    </Box>
  );
}
