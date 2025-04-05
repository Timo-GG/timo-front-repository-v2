import React from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import logo from '../assets/logo.png';
import {
    AppBar,
    Toolbar,
    Box,
    Container,
    Typography,
    Button,
    IconButton,
    Badge,
    Menu,
    MenuItem
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMySetting = () => {
        handleClose();
        navigate('/mysetting'); // 원하는 경로로 이동
    };

    const handleLogout = () => {
        handleClose();
        // 로그아웃 처리 로직 추가
        console.log('로그아웃!');
    };

    // 메뉴 항목 정의
    const menuItems = [
        { label: '전적 검색', path: '/' },
        { label: '랭킹', path: '/ranking' },
        { label: '내전', path: '/custom' },
        { label: '듀오 찾기', path: '/duo' },
        { label: '마이페이지', path: '/mypage' },
    ];
    <Typography
        onClick={() => navigate('/')}
        sx={{
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            borderBottom: '2px solid #42E6B5'
        }}
    >
        전적 검색
    </Typography>

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: '#2b2c3c',
                padding: 0,
                overflow: 'visible'
            }}
        >
            {/* ---------- 첫 번째 줄 (로고, 접속자, 유저 버튼) ---------- */}
            <Box sx={{ borderBottom: '1px solid #3c3d4e' }}>
                <Container maxWidth="lg">
                    <Toolbar
                        sx={{
                            minHeight: '72px',
                            px: 0,
                            py: 1, // 상하 padding
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            {/* 왼쪽: 로고 + 접속자 */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <img src={logo} alt="TIMO.GG logo" style={{ height: 42 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BarChartIcon sx={{ fontSize: 20, color: '#aaa' }} />
                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                        현재 접속중 <span style={{ color: '#ff5b5b' }}>135</span>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ marginLeft: 'auto' }}>
                                <Button
                                    onClick={handleClick}
                                    size="large"
                                    variant="contained"
                                    startIcon={<PersonIcon />}
                                    sx={{
                                        backgroundColor: '#3b3c4f',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        minHeight: '48px',
                                        padding: '8px 20px',
                                        ':hover': { backgroundColor: '#50516a' }
                                    }}
                                >
                                    짱아깨비
                                </Button>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    PaperProps={{
                                        sx: {
                                            backgroundColor: '#2b2c3c',
                                            borderRadius: 2,
                                            mt: 1
                                        }
                                    }}
                                >
                                    <MenuItem
                                        onClick={handleMySetting}
                                        sx={{
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            px: 3,
                                            py: 1.5,
                                            ':hover': { backgroundColor: '#3b3c4f' }
                                        }}
                                    >
                                        내 계정
                                    </MenuItem>
                                    <Box sx={{ height: '1px', backgroundColor: '#3b3c4f', mx: 1 }} />
                                    <MenuItem
                                        onClick={handleLogout}
                                        sx={{
                                            color: '#fff',
                                            fontSize: '1rem',
                                            px: 3,
                                            py: 1.5,
                                            ':hover': { backgroundColor: '#3b3c4f' }
                                        }}
                                    >
                                        로그아웃
                                    </MenuItem>
                                </Menu>
                            </Box>

                        </Box>
                    </Toolbar>
                </Container>
            </Box>

            {/* ---------- 두 번째 줄 (메뉴 탭, 알림) ---------- */}
            <Box sx={{ backgroundColor: '#2d2d32' }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ minHeight: '48px', px: 0 }}>
                        {/* 왼쪽: 메뉴 목록 */}
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Typography
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        variant="body1"
                                        sx={{
                                            cursor: 'pointer',
                                            color: isActive ? '#ffffff' : '#B7B7C9',
                                            fontWeight: isActive ? 'bold' : 'normal',
                                            borderBottom: isActive ? '2px solid #ffffff' : 'none',
                                            pb: 0.5
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                );
                            })}
                        </Box>

                        {/* 오른쪽: 알림 아이콘 */}
                        <Box sx={{ marginLeft: 'auto' }}>
                            <IconButton>
                                <Badge badgeContent={1} color="error">
                                    <NotificationsIcon sx={{ color: '#fff' }} />
                                </Badge>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </Box>
        </AppBar>
    );
}
