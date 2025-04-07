import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Avatar,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SummonerInfo from './SummonerInfo';
import TierBadge from './TierBadge';
import matches from '../data/searchDummy';

export default function MatchHistoryModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <Box sx={{ backgroundColor: '#31313C', color: '#fff', maxHeight: '80vh', overflowY: 'auto' }}>
        <DialogTitle sx={{ px: 2, py: 1.2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 0, mb: 0 }}>
            <SummonerInfo
              name="소환사명"
              tag="소환사태그"
              avatarUrl="https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1234.png"
              copyable
            />
            <Box>
              <TierBadge tier="platinum" score="1" />
            </Box>
          </Box>
        </DialogTitle>
      </Box>
      <Box>
        <DialogContent sx={{
          maxHeight: '55vh', overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { backgroundColor: '#2B2C3C', borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#AAAAAA', borderRadius: '4px' },
        }}>
          {matches.map((match, idx) => (
            <Box
              key={idx}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 0.8,
                backgroundColor: match.resultColor,
                display: 'grid',
                gridTemplateColumns: '13% 15% 15% 17% 10% 1fr',
                alignItems: 'center',
                columnGap: 1,
              }}
            >
              <Box>
                <Typography fontWeight="bold" fontSize={16} color={match.result === '승리' ? '#66CCFF' : '#FF8888'}>
                  {match.result}
                </Typography>
                <Typography fontSize={11}>{match.queueType}</Typography>
                <Typography fontSize={11} color="#ccc">{match.time}</Typography>
                <Typography fontSize={11} color="#ccc">{match.date}</Typography>
              </Box>

              <Box position="relative">
                <Avatar src={match.champion} sx={{ width: 56, height: 56 }} />
                <Box position="absolute" bottom={-5} right={-5} bgcolor="#000" borderRadius={1} px={1}>
                  <Typography fontSize={12} color="#fff">{match.level}</Typography>
                </Box>
              </Box>

              <Typography fontSize={14} fontWeight={'bold'}>
                {match.kda.split(' / ').map((val, i, arr) => (
                  <span key={i}>
                    <span style={{ color: i === 1 ? 'red' : 'white' }}>{val}</span>
                    {i < arr.length - 1 && <span style={{ color: 'white' }}> / </span>}
                  </span>
                ))}
              </Typography>

              <Box display="flex" flexDirection="column" gap={0.5}>
                <Box display="flex">
                  {match.spells.map((url, i) => (
                    <Avatar key={i} src={url} sx={{ width: 24, height: 24, mr: 0.5, borderRadius: 0.5 }} />
                  ))}
                </Box>
                <Box display="flex">
                  {match.perks.map((url, i) => (
                    <Avatar key={i} src={url} sx={{ width: 24, height: 24, mr: 0.5, borderRadius: 0.5 }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 24px)', gap: '4px' }}>
                {match.items.map((url, i) => (
                  <Avatar key={i} src={url} sx={{ width: 24, height: 24, borderRadius: 0.5 }} />
                ))}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <Box sx={{ backgroundColor: '#31313C' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon sx={{ color: '#fff' }} />}
            fullWidth
            sx={{
              backgroundColor: '#65c7a3',
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              py: 1.2,
              '&:hover': { backgroundColor: '#57b294' },
            }}
          >
            <Typography fontSize={16} fontWeight="bold" color="#fff">
              전적 갱신
            </Typography>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
