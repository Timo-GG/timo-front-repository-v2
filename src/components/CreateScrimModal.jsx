
// components/CreateScrimModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Select, MenuItem,
  Button, IconButton, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const POSITION_LIST = ['top', 'jungle', 'mid', 'bottom', 'support'];

const dummyPartyMembers = [
  {
    name: '롤10년차고인물',
    tag: '1234',
    tier: 'emerald',
    score: 1,
    champions: ['Neeko', 'Kaisa', 'Ezreal'],
    avatarUrl: '../src/assets/default.png',
  },
  {
    name: '롤10년차고인물',
    tag: '1234',
    tier: 'emerald',
    score: 1,
    champions: ['Neeko', 'Kaisa', 'Ezreal'],
    avatarUrl: '../src/assets/default.png',
  },
  {},
  {}
];

export default function CreateScrimModal({ open, handleClose }) {
  const [memo, setMemo] = useState('');
  const [map, setMap] = useState('소환사 협곡');
  const [people, setPeople] = useState('5:5');
  const [department, setDepartment] = useState('컴퓨터공학과');
  const [myPosition, setMyPosition] = useState(null);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <Box sx={{ backgroundColor: '#2B2B32', p: 3 }}>
        {/* 헤더 */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontSize="1.1rem" fontWeight="bold" color="#fff">파티 생성하기</Typography>
          <IconButton onClick={handleClose}><CloseIcon sx={{ color: '#aaa' }} /></IconButton>
        </Box>

        {/* 메모 */}
        <TextField
          placeholder="저희랑 내전하실 분 구해요."
          fullWidth
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          sx={{ my: 2, bgcolor: '#1F1F27', input: { color: '#fff' } }}
        />

        {/* 설정 */}
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          {/* 포지션 선택 */}
          <Box display="flex" gap={1}>
            {POSITION_LIST.map((pos) => (
              <Box
                key={pos}
                onClick={() => setMyPosition(pos)}
                sx={{
                  width: 40, height: 40, borderRadius: 1,
                  bgcolor: myPosition === pos ? '#42E6B5' : '#424254',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <img src={`../src/assets/position/${pos}.png`} alt={pos} width={24} height={24} />
              </Box>
            ))}
          </Box>

          {/* 맵 / 인원 / 학과 */}
          <Select value={map} onChange={e => setMap(e.target.value)} sx={{ minWidth: 120, bgcolor: '#1F1F27', color: '#fff' }}>
            <MenuItem value="소환사 협곡">소환사 협곡</MenuItem>
            <MenuItem value="칼바람 나락">칼바람 나락</MenuItem>
          </Select>
          <Select value={people} onChange={e => setPeople(e.target.value)} sx={{ minWidth: 80, bgcolor: '#1F1F27', color: '#fff' }}>
            <MenuItem value="5:5">5:5</MenuItem>
          </Select>
          <Select value={department} onChange={e => setDepartment(e.target.value)} sx={{ minWidth: 150, bgcolor: '#1F1F27', color: '#fff' }}>
            <MenuItem value="컴퓨터공학과">컴퓨터공학과</MenuItem>
            <MenuItem value="전자공학과">전자공학과</MenuItem>
            <MenuItem value="기계공학과">기계공학과</MenuItem>
          </Select>
        </Box>

        {/* 테이블 헤더 */}
        <Box display="flex" justifyContent="space-between" px={1.5} py={1} color="#888" fontSize="0.85rem">
          <Box width="20%">소환사 이름</Box>
          <Box width="10%">티어</Box>
          <Box width="20%">모스트 챔피언</Box>
          <Box width="50%">포지션</Box>
        </Box>

        {/* 파티원 리스트 */}
        {dummyPartyMembers.map((member, i) => (
          <Box key={i} display="flex" alignItems="center" px={1.5} py={1.2} borderTop="1px solid #393946">
            <Box width="20%" display="flex" alignItems="center" gap={1}>
              {member.name ? (
                <>
                  <Avatar src={member.avatarUrl} sx={{ width: 32, height: 32 }} />
                  <Box>
                    <Typography fontSize="0.9rem" color="#fff">{member.name}</Typography>
                    <Typography fontSize="0.75rem" color="#888">#{member.tag}</Typography>
                  </Box>
                </>
              ) : (
                <TextField size="small" placeholder="소환사 이름#NA1" fullWidth sx={{ input: { fontSize: '0.75rem', color: '#ccc' } }} />
              )}
            </Box>
            <Box width="10%" textAlign="center">
              {member.tier ? <Typography fontWeight="bold" color="#42E6B5">{member.tier[0].toUpperCase()}{member.score}</Typography> : '—'}
            </Box>
            <Box width="20%" display="flex" justifyContent="center" gap={1}>
              {member.champions?.length
                ? member.champions.map((c, idx) => (
                    <img key={idx} src={`../src/assets/champions/${c}.png`} alt={c} width={28} height={28} style={{ borderRadius: 4 }} />
                  ))
                : [1, 2, 3].map((_, idx) => (
                    <img key={idx} src="../src/assets/placeholder_champ.png" width={28} height={28} style={{ opacity: 0.3 }} />
                  ))}
            </Box>
            <Box width="50%" display="flex" gap={1} justifyContent="center">
              {POSITION_LIST.map(pos => (
                <Box key={pos} sx={{
                  width: 28, height: 28, borderRadius: 1,
                  backgroundColor: '#393946', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <img src={`../src/assets/position/${pos}.png`} alt={pos} width={18} height={18} />
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {/* 하단 버튼 */}
        <Box display="flex" gap={2} mt={4}>
          <Button fullWidth onClick={handleClose} sx={{ bgcolor: '#2A2B31', color: '#fff', height: 48, fontWeight: 'bold' }}>
            취소
          </Button>
          <Button fullWidth sx={{ bgcolor: '#42E6B5', color: '#000', height: 48, fontWeight: 'bold' }}>
            등록
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}