import React from 'react';
import rankingDummy from '../data/rankingDummy';
import TierBadge from '../components/TierBadge';
import ChampionIconList from '/src/components/champion/ChampionIconList';
import PositionIcon from '../components/PositionIcon';
import EditProfileModal from '../components/rank/EditProfileModal';
import RankingDetailModal from '../components/rank/RankingDetailModal';
import WinRateBar from '../components/WinRateBar';

import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  useTheme,
  Container,
  Avatar,
} from '@mui/material';

// 소환사 정보 카드 (재사용 가능 컴포넌트)
function SummonerInfo({ name, tag, avatarUrl }) {
  return (
    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar src={avatarUrl} alt={name} sx={{ width: 32, height: 32 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography fontSize="0.95rem" lineHeight={1.2} noWrap
          sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</Typography>
        <Typography fontSize="0.8rem" color="#B7B7C9" lineHeight={1.2}>{`#${tag}`}</Typography>
      </Box>
    </Box>
  );
}

export default function RankingPage() {
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (event, newValue) => setTab(newValue);
  const [open, setOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const handleRowClick = (row) => {
    setSelectedData(row);
    setDetailOpen(true);
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
      <Container maxWidth="lg" sx={{ px: 0 }}>
        <Box sx={{
          backgroundColor: theme.palette.background.paper,
          p: 1,
          borderTopLeftRadius: 10,  // 상단만 둥글게
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}>
          {/* 상단 탭 */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}

          >
            <Tab label="전체 대학교" sx={{ fontSize: "1.1rem", color: tab === 0 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 0 ? 'bold' : 'normal' }} />
            <Tab label="우리 학교" sx={{ fontSize: "1.1rem", color: tab === 1 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 1 ? 'bold' : 'normal' }} />
          </Tabs>
        </Box>
        <Box sx={{ height: '1px', backgroundColor: '#171717', width: '100%', position: 'relative' }} />
        <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
          {/* 제목 및 버튼 */}
          <Box sx={{ ml: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h7" color="#42E6B5">
                콜로세움 순위표
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="white">
                {tab === 0 ? '전체 대학교' : '서울과기대'}
              </Typography>
            </Box>
            <Button sx={{ backgroundColor: '#88849B', color: '#fff', borderRadius: 0.5, fontWeight: 'bold', px: 2, py: 1.4 }} onClick={() => setOpen(true)}>
              <Typography variant="h7" fontWeight="bold" color="white">
                내 정보 수정하기
              </Typography>
            </Button>
            <RankingDetailModal
              open={detailOpen}
              handleClose={() => setDetailOpen(false)}
              data={selectedData}
            />

            <EditProfileModal
              open={open}
              handleClose={() => setOpen(false)}
            />
          </Box>
        </Box>
        <Box>
          {/* 테이블 */}
          <Box sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                px: 0,
                py: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#28282F',
                color: '#999',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <Box width="5%" textAlign="center">순위</Box>
              <Box width="15%" textAlign="center">소환사</Box>
              <Box width="10%" textAlign="center">주 포지션</Box>
              <Box width="5%" textAlign="center">티어</Box>
              <Box width="10%" textAlign="center">
                {tab === 0 ? '대학교' : '학과'}
              </Box>
              <Box width="10%" textAlign="center">모스트 챔피언</Box>
              <Box width="15%" textAlign="center">승률(최근 10게임)</Box>
              <Box width="20%" textAlign="center">한 줄 소개</Box>
            </Box>

            {rankingDummy.map((row) => (
              <Box
                key={row.rank}
                onClick={() => handleRowClick(row)} // 모달 열기 등
                sx={{
                  px: 0,
                  py: 1,
                  pr: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: theme.palette.background.paper,
                  color: '#fff',
                  fontSize: 14,
                  borderBottom: '2px solid #12121a',
                  cursor: 'pointer', // 👈 클릭 가능 표시
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: '#2E2E38', // 💡 원하는 hover 색상
                  },
                }}
              >
                <Box width="5%" textAlign="center">{row.rank}</Box>
                <Box width="15%" display="flex">
                  <SummonerInfo name={row.name} tag={row.tag} avatarUrl={row.avatarUrl} />
                </Box>
                <Box width="10%" textAlign="center">
                  <PositionIcon position={row.position} />
                </Box>
                <Box width="5%" textAlign="center">
                  <TierBadge tier={row.tier} score={row.score} />
                </Box>
                <Box width="10%" textAlign="center">
                  {tab === 0 ? row.university : row.department}
                </Box>
                <Box width="10%" textAlign="center">
                  <ChampionIconList championNames={row.champions} />
                </Box>
                <Box width="15%" textAlign="center">
                  <WinRateBar wins={row.wins} losses={row.losses} />
                </Box>
                <Box width="20%" textAlign="center">
                  <Box sx={{
                    backgroundColor: '#424254',
                    p: 1,
                    borderRadius: 1,
                    color: '#fff',
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                    textAlign: 'left',
                    display: '-webkit-inline-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    maxHeight: '3.6em',
                  }}>
                    {row.message}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}