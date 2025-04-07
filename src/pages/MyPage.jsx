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
import SystemMessage from '../components/SystemMessage';
import chatDummy from '../data/chatDummy';
import ChatMessage from '../components/ChatMessage';
import ConfirmDialog from '../components/ConfirmDialog';

const sampleUser = {
    name: '롤10년차고인물',
    tag: '1234',
    school: '서울과기대',
    tier: 'challenger',
    score: 1024,
    mostChamps: ['src/assets/champ1.png', 'src/assets/champ2.png', 'src/assets/champ3.png'],
    message: '현 멀티 2층 최소 다이아 상위듀오 구합니다. 현 멀티 2층 최소 다이아 상위듀오 구합니다.현 멀티 2층 최소 다이아 상위듀오 구합니다.',
    createdAt: '38초 전',
    champions: ["Akali", "Thresh", "Yasuo"],
    type: '듀오',
    wins: 7,
    losses: 3,
};

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ pt: 0 }}>{children}</Box>}
        </div>
    );
}

export default function MyPage() {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [chatInput, setChatInput] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const isSendingRef = useRef(false); // 즉시 업데이트되는 ref 사용
    const [chatList, setChatList] = useState(chatDummy);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [anchorEls, setAnchorEls] = useState({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetChatId, setTargetChatId] = useState(null);

    const handleMenuOpen = (event, id) => {
        setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
    };

    const handleMenuClose = (id) => {
        setAnchorEls((prev) => ({ ...prev, [id]: null }));
    };

    const handleDelete = (id) => {
        setChatList((prev) => prev.filter((chat) => chat.id !== id));

        // 현재 선택된 채팅방이 삭제된 경우, 선택 해제
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
                            messages: [...chat.messages, { type: 'sent', text: trimmed, timestamp: new Date().toISOString() }],
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

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 5 }}>
            <Container maxWidth="lg">
                <TabHeader
                    tab={tab}
                    onTabChange={handleTabChange}
                    firstLabel="받은 요청"
                    secondLabel="보낸 요청"
                    thirdLabel="채팅"
                />
                <TabPanel value={tab} index={0}>
                    <Box>
                        <TableHeader />
                        {[1, 2, 3, 4].map((_, idx) => (
                            <TableItem key={idx} received user={sampleUser} />
                        ))}
                    </Box>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <Box>
                        <TableHeader />
                        {[1, 2, 3, 4].map((_, idx) => (
                            <TableItem key={idx} user={sampleUser} sentStatus={idx === 3 ? '완료' : idx === 2 ? '평가' : '취소'} />
                        ))}
                    </Box>
                </TabPanel>

                <TabPanel value={tab} index={2}>
                    <Box sx={{ display: 'flex', overflow: 'hidden', height: 700, backgroundColor: '#1e1f2d' }}>
                        <Box sx={{ width: 500, backgroundColor: '#2c2c3a', borderRight: '2px solid #171717' }}>
                            {chatList.map((chat) => (
                                <Box key={chat.id} onClick={() => setSelectedChatId(chat.id)}

                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        backgroundColor:
                                            selectedChatId === chat.id ? '#28282F' : 'transparent',
                                    }}>
                                    {/* 윗줄: SummonerInfo */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <SummonerInfo
                                            name={chat.user.name}
                                            tag={chat.user.tag}
                                            avatarUrl={chat.avatarUrl}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, chat.id)}
                                            sx={{ color: '#aaa' }}
                                        >
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
                                        <MenuItem onClick={() => {
                                            setTargetChatId(chat.id);
                                            setOpenConfirm(true);
                                        }}>나가기</MenuItem>
                                    </Menu>
                                    {/* 아랫줄: 메시지 + 시간 */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mt: 0.5,
                                        }}
                                    >
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
                                        <Button size="small" onClick={() => {
                                            setTargetChatId(selectedChat.id);
                                            setOpenConfirm(true);
                                        }} sx={{ border: '1px solid #71717D', borderRadius: 0.8, ml: 'auto', color: '#fff', backgroundColor: '#3b3c4f', px: 2 }}>나가기</Button>
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
                                                <ChatMessage
                                                    key={idx}
                                                    type={msg.type}
                                                    text={msg.text}
                                                    timestamp={msg.timestamp}
                                                    showTime={showTime}
                                                />
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
                                                    '&:hover': { backgroundColor: '#2c2c3a' },
                                                    '&.Mui-focused': { backgroundColor: '#2c2c3a' },
                                                },
                                            }}
                                            sx={{ backgroundColor: '#2c2c3a', borderRadius: 1 }}
                                        />
                                        <IconButton
                                            sx={{ color: '#42E6B5', ml: 1 }}
                                            onClick={handleSendMessage}
                                            disabled={isSendingRef.current}
                                        >
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
        </Box>
    );
}
