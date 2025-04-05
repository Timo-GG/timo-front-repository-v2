import React from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  useTheme,
  Container,
} from '@mui/material';

export default function RankingPage() {
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (event, newValue) => setTab(newValue);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        pt: 5,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ borderRadius: 1, backgroundColor: theme.palette.background.paper, p: 1 }}>
          {/* 상단 탭 */}
          <Tabs value={tab} onChange={handleTabChange} textColor="inherit" TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}>
            <Tab label="전체 대학교" sx={{ color: tab === 0 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 0 ? 'bold' : 'normal' }} />
            <Tab label="우리 학교" sx={{ color: tab === 1 ? '#ffffff' : '#B7B7C9', fontWeight: tab === 1 ? 'bold' : 'normal' }} />
          </Tabs>

          {/* 제목 및 버튼 */}
          <Box sx={{ ml: 1, mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="#42E6B5" fontWeight="bold">
                콜로세움 순위표
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="white">
                {tab === 0 ? '전체 대학교' : '서울과기대'}
              </Typography>
            </Box>
            <Button sx={{ backgroundColor: '#88849B', color: '#fff', borderRadius: 2, fontWeight: 'bold', px: 2, py: 1 }}>
              내 정보 수정
            </Button>
          </Box>

          {/* 테이블 헤더 */}
          <Box
            sx={{
              mt: 3,
              px: 2,
              py: 1,
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#2c2c3a',
              borderRadius: 1,
              color: '#999',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Box width="5%">순위</Box>
            <Box width="15%">소환사</Box>
            <Box width="10%">주 포지션</Box>
            <Box width="10%">티어</Box>
            <Box width="15%">대학교</Box>
            <Box width="20%">모스트 챔피언</Box>
            <Box width="20%">포지션</Box>
            <Box width="10%" textAlign="right">등록 일시</Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
