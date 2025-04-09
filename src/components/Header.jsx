import React, { useState } from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
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
    MenuItem,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import LoginModal from './login/LoginModal';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const userMenuOpen = Boolean(anchorEl);

    const handleUserMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMySetting = () => {
        handleUserMenuClose();
        navigate('/mysetting');
    };

    const handleLogout = () => {
        handleUserMenuClose();
        setUser(null);
    };


    // 알림 상태 관련
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const notificationOpen = Boolean(notificationAnchorEl);

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(notificationAnchorEl ? null : event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    // 알림 리스트 상태
    const [notifications, setNotifications] = useState([
        { id: 1, message: '짱아깨비 님으로부터 듀오 신청이 왔습니다.', time: '1시간 전' },
        { id: 2, message: '짱아깨비 님으로부터 듀오 신청이 왔습니다.', time: '04/01 20:05' },
        { id: 3, message: '짱아깨비 님으로부터 듀오 신청이 왔습니다.', time: '04/01 20:05' },
        { id: 4, message: '짱아깨비 님으로부터 듀오 신청이 왔습니다.', time: '04/01 20:05' },
        { id: 5, message: '짱아깨비 님으로부터 듀오 신청이 왔습니다.', time: '04/01 20:05' },
        { id: 6, message: '짱아깨비 님으로부터 듀오 신청이 왔습니다.', time: '04/01 20:05' },
    ]);

    const handleRemoveNotification = (id) => {
        setNotifications((prev) => prev.filter((noti) => noti.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications([]);
    };

    const menuItems = [
        { label: '전적 검색', path: '/' },
        { label: '랭킹', path: '/ranking' },
        { label: '내전', path: '/scrim' },
        { label: '듀오 찾기', path: '/duo' },
        { label: '마이페이지', path: '/mypage' },
    ];

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    backgroundColor: '#2b2c3c',
                    padding: 0,
                    overflow: 'visible',
                }}
            >
                <Box sx={{ borderBottom: '1px solid #3c3d4e' }}>
                    <Container maxWidth="lg">
                        <Toolbar sx={{ minHeight: '72px', px: 0, py: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                {/* 로고 & 접속자 수 */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <img src={logo} alt="TIMO.GG logo" style={{ height: 42 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BarChartIcon sx={{ fontSize: 20, color: '#aaa' }} />
                                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                                            현재 접속중 <span style={{ color: '#ff5b5b' }}>135</span>
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* 로그인 / 유저 버튼 */}
                                <Box sx={{ marginLeft: 'auto' }}>
                                    {user ? (
                                        <>
                                            <Button
                                                onClick={handleUserMenuClick}
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
                                                    ':hover': { backgroundColor: '#50516a' },
                                                }}
                                            >
                                                {user.displayName}
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={userMenuOpen}
                                                onClose={handleUserMenuClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                PaperProps={{
                                                    sx: {
                                                        backgroundColor: '#2b2c3c',
                                                        borderRadius: 2,
                                                        mt: 1,
                                                    },
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
                                                        ':hover': { backgroundColor: '#3b3c4f' },
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
                                                        ':hover': { backgroundColor: '#3b3c4f' },
                                                    }}
                                                >
                                                    로그아웃
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={() => setIsLoginModalOpen(true)}
                                            size="large"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#3b3c4f',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                minHeight: '48px',
                                                padding: '8px 20px',
                                                ':hover': { backgroundColor: '#50516a' },
                                            }}
                                        >
                                            로그인
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Toolbar>
                    </Container>
                </Box>

                {/* 메뉴 탭 + 알림 */}
                <Box sx={{ backgroundColor: '#2d2d32' }}>
                    <Container maxWidth="lg">
                        <Toolbar sx={{ minHeight: '48px', px: 0 }}>
                            {/* 메뉴 탭 */}
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
                                                pb: 0.5,
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    );
                                })}
                            </Box>

                            {/* 알림 아이콘 */}
                            <Box sx={{ marginLeft: 'auto' }}>
                                <IconButton onClick={handleNotificationClick}>
                                    <Badge badgeContent={notifications.length} color="error">
                                        <NotificationsIcon sx={{ color: '#fff' }} />
                                    </Badge>
                                </IconButton>
                                <Menu
                                    anchorEl={notificationAnchorEl}
                                    open={notificationOpen}
                                    onClose={handleNotificationClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    PaperProps={{
                                        sx: {
                                            backgroundColor: '#2d2d32',
                                            color: '#fff',
                                            width: 320,
                                        
                                            boxShadow: 3,
                                            borderRadius: 1,
                                            overflow: 'visible', // 전체는 스크롤 안 생기게
                                        },
                                    }}
                                >
                                    <Box sx={{ px: 2, pt: 1, pb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                            알림
                                        </Typography>
                                    </Box>

                                    {/* ✅ 알림 리스트만 스크롤 */}
                                    <Box
                                        sx={{
                                            px: 2,
                                            maxHeight: 290,
                                            overflowY: 'auto',
                                            pr: 1,
                                            '&::-webkit-scrollbar': {
                                                width: '6px',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#C1C1C1', // thumb 색상 알림 배경과 동일
                                                borderRadius: 4,
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: '#2d2d32', // track 배경도 알림창 배경과 동일
                                            },
                                        }}
                                    >
                                        {notifications.length > 0 ? (
                                            notifications.map((noti) => (
                                                <Box
                                                    key={noti.id}
                                                    sx={{
                                                        backgroundColor: '#3b3c4f',
                                                        borderRadius: 2,
                                                        p: 1.5,
                                                        mb: 1,
                                                        position: 'relative',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        <strong>짱아깨비</strong> 님으로부터 <strong>듀오 신청</strong>이 왔습니다.
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                                                        {noti.time}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveNotification(noti.id)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            color: '#aaa',
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        ✕
                                                    </IconButton>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" sx={{ color: '#aaa', px: 1, py: 2 }}>
                                                새로운 알림이 없습니다.
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ textAlign: 'center', py: 1 }}>
                                        <Button
                                            size="small"
                                            onClick={handleMarkAllAsRead}
                                            sx={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem',
                                                ':hover': { backgroundColor: '#3b3c4f' },
                                            }}
                                        >
                                            모두 읽음
                                        </Button>
                                    </Box>
                                </Menu>
                            </Box>

                        </Toolbar>
                    </Container>
                </Box>
            </AppBar>

            {/* 로그인 모달 */}
            <LoginModal
                open={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSocialLogin={(userInfo) => {
                    setUser(userInfo);
                }}
            />
        </>
    );
}
