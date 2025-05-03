import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    InputBase,
    IconButton,
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    useTheme,
    Container,
    Avatar,
    Pagination,
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useAuthStore from '../storage/useAuthStore';
import { Collapse } from '@mui/material';

import TierBadge from '../components/TierBadge';
import ChampionIconList from '/src/components/champion/ChampionIconList';
import PositionIcon from '../components/PositionIcon';
import EditProfileModal from '../components/rank/EditProfileModal';
import RankingDetailModal from '../components/rank/RankingDetailModal';
import WinRateBar from '../components/WinRateBar';
import ConfirmRequiredDialog from '../components/ConfirmRequiredDialog';

import { fetchRankingList, fetchRankingByUniversity, fetchMyRankingInfo } from '../apis/rankAPI';

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
    const { accessToken, userData } = useAuthStore();

    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [detailOpen, setDetailOpen] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState(null);
    const [searchText, setSearchText] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [requiredOpen, setRequiredOpen] = React.useState(false);

    const itemsPerPage = 10;
    const myUniversity = userData?.certifiedUnivInfo?.univName || '우리 학교';

    // 랭킹 리스트 가져오기 (5초마다 refetch)
    const {
        data: rankingList = [],
        isLoading,
        isError,
        refetch: refetchRanking,
    } = useQuery({
        queryKey: ['rankingList', tab, userData?.certifiedUnivInfo?.univName],
        queryFn: () => tab === 0 ? fetchRankingList() : fetchRankingByUniversity(userData.certifiedUnivInfo.univName),
        refetchInterval: 5000,
    });

    // 내 프로필 정보 가져오기
    const {
        data: myProfileData,
        isLoading: isProfileLoading,
        isError: isProfileError,
    } = useQuery({
        queryKey: ['myProfile'],
        queryFn: fetchMyRankingInfo,
        enabled: !!accessToken,
    });

    const handleTabChange = (event, newValue) => {
        if (newValue === 1 && !userData?.certifiedUnivInfo) {
            setRequiredOpen(true);
            return;
        }
        setTab(newValue);
    };

    const handleEditClick = () => {
        const hasRiot = Boolean(userData?.riotAccount);
        const hasUniv = Boolean(userData?.certifiedUnivInfo);
        if (!hasRiot || !hasUniv) {
            setRequiredOpen(true);
        } else {
            setOpen(true);
        }
    };

    const totalPages = Math.ceil(rankingList.length / itemsPerPage);
    const paginatedData = rankingList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = () => {
        if (!searchText.trim()) return;

        const found = rankingList.find((item) => {
            const fullName = `${item.name}#${item.tag}`;
            return fullName.toLowerCase() === searchText.toLowerCase();
        });

        if (found) {
            setSelectedData(found);
            setDetailOpen(true);
        } else {
            alert('해당 소환사를 찾을 수 없습니다.');
        }
    };

    const handleRowClick = (row) => {
        setSelectedData(row);
        setDetailOpen(true);
    };
    const [displayList, setDisplayList] = React.useState([]);

    React.useEffect(() => {
        const currentKeys = new Set(displayList.map(r => `${r.name}#${r.tag}`));
        const newKeys = new Set(rankingList.map(r => `${r.name}#${r.tag}`));

        const updatedList = rankingList.map(r => ({
            ...r,
            isNew: !currentKeys.has(`${r.name}#${r.tag}`),
            isVisible: true,
        }));

        // 삭제된 항목 감지
        const removedItems = displayList.filter(r => !newKeys.has(`${r.name}#${r.tag}`))
            .map(r => ({ ...r, isVisible: false }));

        setDisplayList([...updatedList, ...removedItems]);
    }, [rankingList]);

    const handleExited = (key) => {
        setDisplayList((prev) => prev.filter(r => `${r.name}#${r.tag}` !== key));
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }    if (isError) return <div style={{ color: 'red' }}>랭킹 데이터를 불러오는 중 오류가 발생했습니다.</div>;

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg" sx={{ px: 0 }}>
                {/* 탭 영역 */}
                <Box sx={{
                    backgroundColor: theme.palette.background.paper,
                    p: 1,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        textColor="inherit"
                        TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}
                    >
                        <Tab label="전체 대학교" sx={{
                            fontSize: "1.1rem",
                            color: tab === 0 ? '#ffffff' : '#B7B7C9',
                            fontWeight: tab === 0 ? 'bold' : 'normal'
                        }} />
                        <Tab label="우리 학교" sx={{
                            fontSize: "1.1rem",
                            color: tab === 1 ? '#ffffff' : '#B7B7C9',
                            fontWeight: tab === 1 ? 'bold' : 'normal'
                        }} />
                    </Tabs>
                </Box>

                <Box sx={{ height: '1px', backgroundColor: '#171717', width: '100%' }} />

                {/* 헤더 */}
                <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
                    <Box sx={{ ml: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h7" color="#42E6B5">콜로세움 순위표</Typography>
                            <Typography variant="h5" fontWeight="bold" color="white">
                                {tab === 0 ? '전체 대학교' : myUniversity}
                            </Typography>
                        </Box>

                        {/* 검색창 + 버튼 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    backgroundColor: '#2B2C3C',
                                    border: '1px solid #424254',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: 40,
                                    pl: 1.5,
                                    pr: 1.5,
                                    minWidth: 120,
                                }}
                            >
                                <IconButton onClick={handleSearch}>
                                    <SearchIcon sx={{ color: '#424254' }} />
                                </IconButton>
                                <InputBase
                                    placeholder="플레이어 이름 + #태그"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSearch();
                                    }}
                                    sx={{ flex: 1, color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', ml: 1, mr: 1 }}
                                />
                            </Box>

                            <Button
                                sx={{
                                    backgroundColor: '#88849B',
                                    color: '#fff',
                                    borderRadius: 0.5,
                                    fontWeight: 'bold',
                                    px: 2,
                                    py: 1.4,
                                    height: 40,
                                }}
                                onClick={handleEditClick}
                            >
                                <Typography variant="h7" fontWeight="bold" color="white">
                                    내 정보 수정하기
                                </Typography>
                            </Button>
                        </Box>

                        {/* 모달들 */}
                        <RankingDetailModal
                            open={detailOpen}
                            handleClose={() => setDetailOpen(false)}
                            data={selectedData}
                        />
                        <EditProfileModal
                            open={open}
                            handleClose={() => setOpen(false)}
                            userProfileData={myProfileData}
                        />
                    </Box>
                </Box>

                {/* 테이블 영역 */}
                <Box>
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
                            <Box width="10%" textAlign="center">{tab === 0 ? '대학교' : '학과'}</Box>
                            <Box width="10%" textAlign="center">모스트 챔피언</Box>
                            <Box width="15%" textAlign="center">승률(최근 10게임)</Box>
                            <Box width="20%" textAlign="center">한 줄 소개</Box>
                        </Box>

                        {displayList
                            .filter(row => row.isVisible)
                            .sort((a, b) => a.ranking - b.ranking) // 순위 정렬
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((row) => {
                                const key = `${row.name}#${row.tag}`;
                                return (
                                    <Collapse
                                        key={key}
                                        in={row.isVisible}
                                        timeout={500}
                                        onExited={() => handleExited(key)}
                                    >
                                        <Box
                                            onClick={() => handleRowClick(row)}
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
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                '&:hover': { backgroundColor: '#2E2E38' },
                                            }}
                                        >
                                <Box width="5%" textAlign="center">{row.ranking}</Box>
                                <Box width="15%" display="flex">
                                    <SummonerInfo
                                        name={row.name}
                                        tag={row.tag}
                                        avatarUrl={row.avatarUrl}
                                    />
                                </Box>
                                <Box width="10%" textAlign="center"><PositionIcon position={row.position} /></Box>
                                <Box width="5%" textAlign="center"><TierBadge tier={row.tier} score={row.lp} rank={row.rank} /></Box>
                                <Box width="10%" textAlign="center">{tab === 0 ? row.university : row.department}</Box>
                                <Box width="10%" textAlign="center"><ChampionIconList championNames={row.champions} /></Box>
                                <Box width="15%" textAlign="center"><WinRateBar wins={row.wins} losses={row.losses} /></Box>
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
                                    </Collapse>
                                );
                            })}
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(e, value) => setCurrentPage(value)}
                                shape="rounded"
                                color="primary"
                                sx={{
                                    '& .MuiPaginationItem-root': { color: '#fff' },
                                    '& .Mui-selected': { backgroundColor: '#42E6B5', color: '#000' },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Container>
            <ConfirmRequiredDialog
                open={requiredOpen}
                onClose={() => setRequiredOpen(false)}
            />
        </Box>
    );
}
