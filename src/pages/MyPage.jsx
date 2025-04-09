// src/pages/MyPage.jsx
import React, { useState, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Button,
    Avatar,
    useTheme,
    TextField,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TierImage from '../assets/tier.png';
import TabHeader from '../components/TabHeader';
import TableHeader from '../components/TableHeader';
import TableItem from '../components/TableItem';
import SummonerInfo from '../components/SummonerInfo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SystemMessage from '/src/components/chat/SystemMessage';
import chatDummy from '../data/chatDummy';
import ChatMessage from '/src/components/chat/ChatMessage';
import ConfirmDialog from '/src/components/ConfirmDialog';

// 모달창들
import DuoDetailModal from '/src/components/duo/DuoDetailModal';
import ScrimRequestModal from '/src/components/scrim/ScrimRequestModal';
import CreateDuoModal from '/src/components/duo/CreateDuoModal';

// type이 '듀오'와 '내전'인 데이터를 구분하기 위한 예시 sampleUsers
const sampleUsers = [
    {
        name: '롤10년차고인물',
        tag: '1234',
        school: '서울과기대',
        department: '컴퓨터공학과',
        map: '솔로 랭크',
        tier: 'platinum',
        score: 2,
        message:
            '현 멀티 2층 최소 다이아 상위듀오 구합니다.',
        playStyle: '즐겜',
        status: '첫판',
        mic: '가능',
        gender: '남성',
        mbti: 'ENTJ',
        createdAt: '38초 전',
        champions: ['Akali', 'Thresh', 'Yasuo'],
        type: '듀오',
        wins: 7,
        losses: 3,
        members: [
            {
                name: '롤10년차고인물',
                tag: '1234',
                avatarUrl:
                    'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1234.png',
                tier: 'platinum',
                score: 2,
                champions: ['Akali', 'Thresh', 'Yasuo'],
                position: 'jungle',
            },
        ],
    },
    {
        name: '솔랭장인',
        tag: '1111',
        school: '성균관대',
        department: '경제학과',
        map: '소환사 협곡',
        tier: 'diamond',
        score: 1,
        message:
            '팀운이 부족해 탑 듀오 구합니다. 꾸준한 플레이로 팀에 기여할 자신이 있습니다.',
        playStyle: '신중함',
        status: '듀오 가능',
        mic: '사용 안 함',
        gender: '남성',
        mbti: 'ISTJ',
        createdAt: '10분 전',
        champions: ['Gnar', 'Shen', 'Malphite'],
        type: '내전',
        wins: 5,
        losses: 5,
        members: [
            {
                name: '솔랭장인',
                tag: '1111',
                avatarUrl:
                    'https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/1111.png',
                tier: 'diamond',
                score: 1,
                champions: ['Gnar', 'Shen', 'Malphite'],
                position: 'top',
            },
        ],
    },
];

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ pt: 0 }}>{children}</Box>}</div>;
}

export default function MyPage() {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [chatInput, setChatInput] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const isSendingRef = useRef(false);
    const [chatList, setChatList] = useState(chatDummy);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [anchorEls, setAnchorEls] = useState({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetChatId, setTargetChatId] = useState(null);
    // 듀오와 내전 모달을 위한 상태
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedScrim, setSelectedScrim] = useState(null);

    const handleMenuOpen = (event, id) => {
        setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
    };

    const handleMenuClose = (id) => {
        setAnchorEls((prev) => ({ ...prev, [id]: null }));
    };

    const handleDelete = (id) => {
        setChatList((prev) => prev.filter((chat) => chat.id !== id));
        if (selectedChatId === id) {
            setSelectedChatId(null);
        }
        handleMenuClose(id);
    };

    const handleTabChange = (_, newValue) => setTab(newValue);

    const handleSendMessage = () => {
        const trimmed = chatInput.trim();
        if (!trimmed || isSendingRef.current || selectedChatId === null) return;

        isSendingRef.current = true;
        try {
            setChatList((prev) =>
                prev.map((chat) =>
                    chat.id === selectedChatId
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                { type: 'sent', text: trimmed, timestamp: new Date().toISOString() },
                            ],
                            lastMessage: trimmed,
                            lastTime: '방금 전',
                        }
                        : chat
                )
            );
            setChatInput('');
        } finally {
            isSendingRef.current = false;
        }
    };

    const selectedChat = chatList.find((chat) => chat.id === selectedChatId);
    const handleRowClick = (user) => {
        // 만약 행의 type이 '듀오'면 DuoDetailModal,
        // '내전'이면 ScrimRequestModal을 열도록 분기 처리합니다.
        if (user.type === '듀오') {
            setSelectedUser(user);
        } else if (user.type === '내전') {
            setSelectedScrim(user);
        }
    };

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg">
                <TabHeader tab={tab} onTabChange={handleTabChange} firstLabel="받은 요청" secondLabel="보낸 요청" thirdLabel="채팅" />

                {/* 받은 요청 탭 */}
                <TabPanel value={tab} index={0}>
                    <Box>
                        <TableHeader />
                        {sampleUsers.map((user, idx) => (
                            <Box
                                key={idx}
                                onClick={() => handleRowClick(user)}
                                sx={(user.type === '듀오' || user.type === '내전') ? { cursor: 'pointer' } : {}}
                            >
                                <TableItem received user={user} />
                            </Box>
                        ))}
                    </Box>
                </TabPanel>

                {/* 보낸 요청 탭 */}
                <TabPanel value={tab} index={1}>
                    <Box>
                        <TableHeader />
                        {sampleUsers.map((user, idx) => (
                            <Box
                                key={idx}
                                onClick={() => handleRowClick(user)}
                                sx={(user.type === '듀오' || user.type === '내전') ? { cursor: 'pointer' } : {}}
                            >
                                <TableItem user={user} sentStatus={idx === 3 ? '완료' : idx === 2 ? '평가' : '취소'} />
                            </Box>
                        ))}
                    </Box>
                </TabPanel>

                {/* 채팅 탭 */}
                <TabPanel value={tab} index={2}>
                    <Box sx={{ display: 'flex', overflow: 'hidden', height: 700, backgroundColor: '#1e1f2d' }}>
                        <Box sx={{ width: 500, backgroundColor: '#2c2c3a', borderRight: '2px solid #171717' }}>
                            {chatList.map((chat) => (
                                <Box
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        backgroundColor: selectedChatId === chat.id ? '#28282F' : 'transparent',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <SummonerInfo name={chat.user.name} tag={chat.user.tag} avatarUrl={chat.avatarUrl} />
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, chat.id)} sx={{ color: '#aaa' }}>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Menu
                                        anchorEl={anchorEls[chat.id]}
                                        open={Boolean(anchorEls[chat.id])}
                                        onClose={() => handleMenuClose(chat.id)}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                setTargetChatId(chat.id);
                                                setOpenConfirm(true);
                                            }}
                                        >
                                            나가기
                                        </MenuItem>
                                    </Menu>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                        <Typography fontSize={14} color="#aaa">
                                            {chat.lastMessage}
                                        </Typography>
                                        <Typography fontSize={14} color="#666">
                                            {chat.lastTime}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#292933' }}>
                            {selectedChat ? (
                                <>
                                    <Box sx={{ p: 2, borderBottom: '1px solid #3b3c4f', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SummonerInfo
                                            name={selectedChat.user.name}
                                            tag={selectedChat.user.tag}
                                            avatarUrl={selectedChat.user.avatarUrl}
                                            copyable
                                            sx={{ flex: 1 }}
                                        />
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                setTargetChatId(selectedChat.id);
                                                setOpenConfirm(true);
                                            }}
                                            sx={{ border: '1px solid #71717D', borderRadius: 0.8, ml: 'auto', color: '#fff', backgroundColor: '#3b3c4f', px: 2 }}
                                        >
                                            나가기
                                        </Button>
                                    </Box>
                                    <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
                                        <SystemMessage message="2025년 4월 3일" />
                                        <SystemMessage message="채팅방이 생성되었습니다." />
                                        {selectedChat.messages.map((msg, idx, arr) => {
                                            const prev = arr[idx - 1];
                                            const showTime =
                                                !prev ||
                                                new Date(msg.timestamp).getMinutes() !== new Date(prev.timestamp).getMinutes();
                                            return msg.type === 'system' ? (
                                                <SystemMessage key={idx} message={msg.text} />
                                            ) : (
                                                <ChatMessage key={idx} type={msg.type} text={msg.text} timestamp={msg.timestamp} showTime={showTime} />
                                            );
                                        })}
                                    </Box>
                                    <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #3b3c4f', backgroundColor: '#1e1f2d' }}>
                                        <TextField
                                            fullWidth
                                            placeholder="내용을 입력해주세요.."
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onCompositionStart={() => setIsComposing(true)}
                                            onCompositionEnd={() => setIsComposing(false)}
                                            onKeyDown={(e) => {
                                                if (isComposing) return;
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: {
                                                    color: '#fff',
                                                    pl: 2,
                                                    backgroundColor: '#2c2c3a',
                                                    borderRadius: 1,
                                                },
                                            }}
                                            sx={{ backgroundColor: '#2c2c3a', borderRadius: 1 }}
                                        />
                                        <IconButton sx={{ color: '#42E6B5', ml: 1 }} onClick={handleSendMessage} disabled={isSendingRef.current}>
                                            <SendIcon />
                                        </IconButton>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                    <Typography>대화방을 선택해주세요.</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </TabPanel>
                <ConfirmDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={() => {
                        if (targetChatId !== null) {
                            handleDelete(targetChatId);
                        }
                        setOpenConfirm(false);
                    }}
                    title="정말 나가시겠습니까?"
                    message="채팅방에서 나가면 대화 내용이 사라집니다."
                    confirmText="나가기"
                    cancelText="취소"
                    danger
                />
            </Container>

            {/* 듀오 타입인 행 클릭 시 DuoDetailModal 열기 */}
            {selectedUser && (
                <DuoDetailModal
                    open={Boolean(selectedUser)}
                    handleClose={() => setSelectedUser(null)}
                    partyData={selectedUser || {}}
                />
            )}

            {/* 내전 타입인 행 클릭 시 ScrimRequestModal 열기 */}
            {selectedScrim && (
                <ScrimRequestModal
                    open={Boolean(selectedScrim)}
                    handleClose={() => setSelectedScrim(null)}
                    partyId={selectedScrim.id}
                    scrims={[selectedScrim]}
                />
            )}
        </Box>
    );
}
