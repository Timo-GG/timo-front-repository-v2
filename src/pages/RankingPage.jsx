import React from 'react';
import rankingDummy from '../data/rankingDummy';
import TierBadge from '../components/TierBadge';
import ChampionIconList from '../components/ChampionIconList';
import PositionIcon from '../components/PositionIcon';

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

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ borderRadius: 0.5, backgroundColor: theme.palette.background.paper, p: 1 }}>
          {/* 상단 탭 */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}
          >
            <Tab label="전체 대학교" sx={{ fontSize: "1rem", color: tab === 0 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 0 ? 'bold' : 'normal' }} />
            <Tab label="우리 학교" sx={{ fontSize: "1rem", color: tab === 1 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 1 ? 'bold' : 'normal' }} />
          </Tabs>
          <Box sx={{ height: '1px', backgroundColor: '#171717' }} />

          {/* 제목 및 버튼 */}
          <Box sx={{ ml: 1, mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" color="#42E6B5">
                콜로세움 순위표
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="white">
                {tab === 0 ? '전체 대학교' : '서울과기대'}
              </Typography>
            </Box>
            <Button sx={{ backgroundColor: '#88849B', color: '#fff', borderRadius: 1, fontWeight: 'bold', px: 2, py: 1.4 }}>
              <Typography variant="h6" fontWeight="bold" color="white">
                내 정보 수정
              </Typography>
            </Button>
          </Box>

          {/* 테이블 */}
          <Box sx={{ mt: 2, borderRadius: 1, overflow: 'hidden' }}>
            <Box
              sx={{
                px: 2,
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
              <Box width="10%" textAlign="center">티어</Box>
              <Box width="15%" textAlign="center">대학교</Box>
              <Box width="20%" textAlign="center">모스트 챔피언</Box>
              <Box width="20%" textAlign="center">한 줄 소개</Box>
              <Box width="10%" textAlign="center">등록 일시</Box>
            </Box>

            {rankingDummy.map((row) => (
              <Box
                key={row.rank}
                sx={{
                  px: 2,
                  py: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: theme.palette.background.paper,
                  color: '#fff',
                  fontSize: 14,
                  borderTop: '1px solid #3c3d4e',
                }}
              >
                <Box width="5%" textAlign="center">{row.rank}</Box>
                <Box width="15%" display="flex">
                  <SummonerInfo name={row.name} tag={row.tag} avatarUrl={row.avatarUrl} />
                </Box>
                <Box width="10%" textAlign="center">
                  <PositionIcon position={row.position} />
                </Box>
                <Box width="10%" textAlign="center">
                  <TierBadge tier={row.tier} score={row.score} />
                </Box>
                <Box width="15%" textAlign="center">{row.university}</Box>
                <Box width="20%" textAlign="center">
                  <ChampionIconList championNames={row.champions} />
                </Box>
                <Box width="20%" textAlign="center">
                  <Box sx={{ backgroundColor: '#424254', p: 1, borderRadius: 1, color: '#fff', fontSize: '0.85rem', display: 'inline-block' }}>
                    {row.message}
                  </Box>
                </Box>
                <Box width="10%" textAlign="center">{row.time}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}