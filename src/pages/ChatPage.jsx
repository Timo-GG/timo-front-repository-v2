// src/components/chat/ChatPage.jsx
import React, {useState, useRef, useEffect, useMemo} from 'react';
import {useSearchParams, useLocation, useNavigate} from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    Menu,
    MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useChatStore from '../storage/useChatStore';
import useAuthStore from '../storage/useAuthStore';
import SummonerInfo from '../components/SummonerInfo';
import ChatMessage from '../components/chat/ChatMessage';
import SystemMessage from '../components/chat/SystemMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import {sendMessage, leaveChatRoom, joinChatRoom} from '../socket/chatSocket';
import {getSocket} from '../socket/socket';
import {
    fetchChatRooms,
    fetchChatMessages,
    leaveChatRoom as apiLeaveChatRoom,
} from '../apis/chatAPI';
import {initializeChatSocket} from '../socket/chatSocket';
import {formatRelativeTime} from '../utils/timeUtils'; // ✅ 추가

export default function ChatPage() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const {chatList, setChatList, addMessage, updateMessages} = useChatStore();
    const {userData} = useAuthStore();

    // URL에서 roomId 파싱 (NaN이면 null)
    const roomIdFromUrl = useMemo(() => {
        const id = parseInt(searchParams.get('roomId'), 10);
        return isNaN(id) ? null : id;
    }, [searchParams]);

    // URL state의 shouldJoin 플래그 (기본값 false)
    const shouldJoin = location.state?.shouldJoin === true;

    // 채팅방 클릭 시 선택된 채팅방 ID (shouldJoin일 경우 URL roomId 사용)
    const [selectedChatId, setSelectedChatId] = useState(shouldJoin ? roomIdFromUrl : null);
    const [chatInput, setChatInput] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const [anchorEls, setAnchorEls] = useState({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetChatId, setTargetChatId] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const chatContainerRef = useRef(null);
    const isFetching = useRef(false);
    const isInitialLoad = useRef(true);
    const isPaging = useRef(false);

    // 채팅 리스트 배열 보장
    const safeChatList = useMemo(() => (Array.isArray(chatList) ? chatList : []), [chatList]);
    // 선택된 채팅방 객체
    const selectedChat = useMemo(
        () => safeChatList.find(chat => chat.id === selectedChatId) || null,
        [safeChatList, selectedChatId]
    );

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (!container || isFetching.current || !hasMore) return;

        if (container.scrollTop < 50) {
            const prevScrollHeight = container.scrollHeight;
            const prevScrollTop = container.scrollTop;

            isPaging.current = true;
            isFetching.current = true;

            // ✅ API 함수 사용
            fetchChatMessages(selectedChatId, page)
                .then((rawMessages) => {
                    const formatted = rawMessages
                        .map(msg => ({
                            type: msg.senderId === userData?.memberId ? 'sent' : 'received',
                            text: msg.content,
                            timestamp: msg.timestamp,
                        }))
                        .reverse();

                    if (formatted.length === 0) {
                        setHasMore(false);
                    } else {
                        updateMessages(selectedChatId, formatted, true);
                        setPage(prev => prev + 1);

                        setTimeout(() => {
                            const newScrollHeight = container.scrollHeight;
                            const scrollDelta = newScrollHeight - prevScrollHeight;
                            container.scrollTop = prevScrollTop + scrollDelta;
                            console.log('[스크롤] 페이지 로딩 후 스크롤 위치 조정:', {prevScrollTop, scrollDelta});
                            isPaging.current = false;
                        }, 0);
                    }
                })
                .catch((err) => console.error('[페이징 메시지 로딩 실패]', err))
                .finally(() => {
                    isFetching.current = false;
                });
        }
    };

    // --- 메시지 업데이트 시 자동 스크롤 ---
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container || !selectedChat?.messages?.length) return;

        if (isInitialLoad.current && !isPaging.current) {
            isInitialLoad.current = false;
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
                console.log('[스크롤] ✅ 최초 진입 하단 이동');
            }, 0);
            return;
        }

        const threshold = 100;
        const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        if (distanceToBottom < threshold) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
                console.log('[스크롤] ✅ 새 메시지로 인한 하단 이동 (사용자 근처)');
            }, 0);
        }
    }, [selectedChat?.messages]);

    // --- 채팅방 목록 불러오기 ---
    useEffect(() => {
        console.log('[ChatPage] 채팅방 목록 로딩 시작');

        // ✅ API 함수 사용
        fetchChatRooms()
            .then((response) => {
                const rooms = response.data; // APIDataResponse의 data 필드
                if (!Array.isArray(rooms)) return;

                const formatted = rooms.map((room) => {
                    const existing = chatList.find((c) => c.id === room.roomId);
                    return {
                        id: room.roomId,
                        messages: existing?.messages || [],
                        user: {
                            // ✅ 백엔드 응답 구조에 맞게 수정
                            name: `${room.opponentGameName}`,
                            tag: room.opponentTagLine,
                            avatarUrl: room.opponentProfileUrl,
                            school: room.opponentUnivName,
                        },
                        lastMessage: room.lastMessage,
                        lastTime: room.lastMessageTime,
                        lastTimeFormatted: formatRelativeTime(room.lastMessageTime), // ✅ 포맷된 시간 추가
                        unreadCount: room.unreadCount,
                    };
                });

                console.log('[ChatPage] 채팅방 목록 로딩 성공:', formatted.map((r) => r.id));
                setChatList(formatted);
            })
            .catch((err) => console.error('[ChatPage] 채팅방 목록 로딩 실패:', err));
    }, [setChatList]);

    useEffect(() => {
        const updateRelativeTimes = () => {
            setChatList(prevList =>
                prevList.map(chat => ({
                    ...chat,
                    lastTimeFormatted: formatRelativeTime(chat.lastTime)
                }))
            );
        };

        // 1분마다 시간 업데이트
        const interval = setInterval(updateRelativeTimes, 60000);
        return () => clearInterval(interval);
    }, [setChatList]);


    // --- 채팅방 입장 ---
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !socket.connected || selectedChatId === null) {
            console.log('[ChatPage] 소켓 입장 조건 미충족:', {socket, selectedChatId});
            return;
        }

        const joinKey = `shouldJoin:${selectedChatId}`;
        if (sessionStorage.getItem(joinKey) !== 'true') {
            console.log(`[ChatPage] ${joinKey} 값이 없으므로 join_room 생략`);
            return;
        }

        console.log(`[ChatPage] 채팅방 ${selectedChatId} 입장 요청`);
        // ✅ Socket 이벤트로 방 입장
        joinChatRoom(selectedChatId);

        return () => {
            console.log(`[ChatPage] 채팅방 ${selectedChatId} 퇴장 요청`);
            leaveChatRoom({roomId: selectedChatId});
        };
    }, [selectedChatId]);


    // --- URL state에 따른 입장 플래그 설정 ---
    useEffect(() => {
        if (roomIdFromUrl && shouldJoin) {
            console.log(`[ChatPage] URL state에 따라 roomId ${roomIdFromUrl} join 플래그 설정`);
            sessionStorage.setItem(`shouldJoin:${roomIdFromUrl}`, 'true');
        }
    }, [roomIdFromUrl, shouldJoin, location.state]);

    // --- 메시지 전송 ---
    const handleSendMessage = () => {
        const text = chatInput.trim();
        if (!text || !selectedChatId) return;
        console.log(`[ChatPage] 메시지 전송: "${text}" to room ${selectedChatId}`);
        const message = {
            type: 'sent',
            text,
            timestamp: new Date().toISOString(),
        };
        addMessage(selectedChatId, message);
        sendMessage({roomId: selectedChatId, content: text});
        setChatInput('');
    };

    // --- 채팅방 나가기 ---
    const handleDelete = async (id) => {
        try {
            // ✅ API 함수 사용
            await apiLeaveChatRoom(id);
            console.log(`[ChatPage] 채팅방 ${id} 나가기 성공`);
            setChatList(prev => prev.filter(chat => chat.id !== id));
            if (selectedChatId === id) {
                setSelectedChatId(null);
            }
            sessionStorage.removeItem(`shouldJoin:${id}`);
            setAnchorEls(prev => ({...prev, [id]: null}));
            navigate('/mypage?tab=chat');
        } catch (err) {
            console.error(`[ChatPage] 채팅방 ${id} 나가기 실패:`, err);
            alert('채팅방 나가기에 실패했습니다.');
        }
    };

    // --- 초기 메시지 로딩 (page 0) ---
    useEffect(() => {
        if (!selectedChatId || !userData) return;

        const current = chatList.find(c => c.id === selectedChatId);
        if (current && current.messages.length > 0) {
            console.log(`[ChatPage] 메시지 이미 있음 → 스킵`);
            return;
        }

        console.log('[ChatPage] 초기 메시지 로딩 시작, userData:', userData);

        // ✅ API 함수 사용
        fetchChatMessages(selectedChatId, 0)
            .then(rawMessages => {
                console.log('[ChatPage] API 응답:', rawMessages);
                const formatted = rawMessages.map(msg => ({
                    type: msg.senderId === userData.memberId ? 'sent' : 'received',
                    text: msg.content,
                    timestamp: msg.timestamp,
                })).reverse();

                updateMessages(selectedChatId, formatted);
                console.log('[ChatPage] 메시지 로딩 성공:', formatted);
            })
            .catch(err => {
                console.error('[ChatPage] 메시지 로딩 실패:', err);
            });
    }, [selectedChatId, userData?.memberId]);

    // --- 채팅방 변경 시 초기화 ---
    useEffect(() => {
        isInitialLoad.current = true;
    }, [selectedChatId]);

    // --- 스크롤 이벤트 핸들러 등록 ---
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [selectedChatId, page, hasMore]);

    useEffect(() => {
        initializeChatSocket();
    }, []); // 한 번만 실행

    // --- 렌더링 ---
    return (
        <>
            <Box sx={{display: 'flex', height: 700, overflow: 'hidden', backgroundColor: '#1e1f2d'}}>
                {/* 왼쪽: 채팅방 목록 */}
                <Box sx={{width: 500, backgroundColor: '#2c2c3a', borderRight: '2px solid #171717'}}>
                    {safeChatList.length > 0 ? (
                        safeChatList.map(chat => (
                            <Box
                                key={chat.id}
                                onClick={() => {
                                    console.log(`[ChatPage] 채팅방 클릭 -> setSelectedChatId(${chat.id})`);
                                    sessionStorage.setItem(`shouldJoin:${chat.id}`, 'true');
                                    setSelectedChatId(chat.id);
                                }}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    backgroundColor: selectedChatId === chat.id ? '#28282F' : 'transparent',
                                }}
                            >
                                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                    <SummonerInfo {...chat.user} />
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAnchorEls(prev => ({...prev, [chat.id]: e.currentTarget}));
                                        }}
                                    >
                                        <MoreVertIcon sx={{color: '#aaa'}}/>
                                    </IconButton>
                                </Box>
                                <Menu
                                    anchorEl={anchorEls[chat.id]}
                                    open={Boolean(anchorEls[chat.id])}
                                    onClose={() => setAnchorEls(prev => ({...prev, [chat.id]: null}))}
                                >
                                    <MenuItem onClick={() => {
                                        setTargetChatId(chat.id);
                                        setOpenConfirm(true);
                                    }}>
                                        나가기
                                    </MenuItem>
                                </Menu>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography fontSize={14} color="#aaa">{chat.lastMessage}</Typography>
                                    <Typography fontSize={14} color="#666">{chat.lastTimeFormatted}</Typography>
                                </Box>
                                {/* ✅ 안 읽은 메시지 수 표시 */}
                                {chat.unreadCount > 0 && (
                                    <Box sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        backgroundColor: '#ff4444',
                                        borderRadius: '50%',
                                        minWidth: 20,
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Typography fontSize={12} color="#fff">{chat.unreadCount}</Typography>
                                    </Box>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{p: 2}}>
                            <Typography variant="body1" color="#aaa">채팅방이 없습니다.</Typography>
                        </Box>
                    )}
                </Box>

                {/* 오른쪽: 선택한 채팅방의 대화 UI */}
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#292933'}}>
                    {selectedChat ? (
                        <>
                            <Box sx={{p: 2, borderBottom: '1px solid #3b3c4f', display: 'flex', alignItems: 'center'}}>
                                <SummonerInfo {...selectedChat.user} />
                                <Button
                                    size="small"
                                    sx={{ml: 'auto', color: '#fff'}}
                                    onClick={() => {
                                        setTargetChatId(selectedChat.id);
                                        setOpenConfirm(true);
                                    }}
                                >
                                    나가기
                                </Button>
                            </Box>
                            <Box ref={chatContainerRef} sx={{flex: 1, p: 2, overflowY: 'auto'}}>
                                <SystemMessage message="채팅방이 생성되었습니다."/>
                                {selectedChat.messages.length > 0 ? (
                                    selectedChat.messages.map((msg, idx) => (
                                        <ChatMessage key={idx} {...msg} />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="#aaa">메시지가 없습니다.</Typography>
                                )}
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                p: 2,
                                borderTop: '1px solid #3b3c4f',
                                backgroundColor: '#1e1f2d'
                            }}>
                                <TextField
                                    fullWidth
                                    placeholder="메시지를 입력하세요..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (isComposing) return;
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    onCompositionStart={() => setIsComposing(true)}
                                    onCompositionEnd={() => setIsComposing(false)}
                                    InputProps={{
                                        sx: {color: '#fff', backgroundColor: '#2c2c3a', borderRadius: 1, pl: 2},
                                    }}
                                />
                                <IconButton sx={{color: '#42E6B5', ml: 1}} onClick={handleSendMessage}>
                                    <SendIcon/>
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#aaa'
                        }}>
                            <Typography>대화방을 선택해주세요.</Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* 채팅방 나가기 확인 다이얼로그 */}
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={() => {
                    if (targetChatId) handleDelete(targetChatId);
                    setOpenConfirm(false);
                }}
                title="정말 나가시겠습니까?"
                message="채팅방에서 나가면 대화 내용이 사라집니다."
                confirmText="나가기"
                cancelText="취소"
                danger
            />
        </>
    );
}
