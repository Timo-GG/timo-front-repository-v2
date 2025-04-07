// src/pages/MyPage.jsx
import React, { useState } from 'react';
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
    IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TierImage from '../assets/tier.png';
import TabHeader from '../components/TabHeader';
import TableHeader from '../components/TableHeader';
import TableItem from '../components/TableItem';

const sampleUser = {
    name: '롤10년차고인물',
    tag: '#1234',
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

    const handleTabChange = (_, newValue) => setTab(newValue);

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
                    <Box sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden', height: 500, backgroundColor: '#1e1f2d' }}>
                        <Box sx={{ width: 300, backgroundColor: '#2c2c3a', p: 2 }}>
                            {[1, 2, 3].map((_, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Avatar src="/src/assets/icon.png" />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography fontWeight="bold" color="#fff">{sampleUser.name}</Typography>
                                        <Typography fontSize={12} color="#aaa">안녕하세요.</Typography>
                                    </Box>
                                    <Typography fontSize={10} color="#666">35분 전</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#292933' }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #3b3c4f', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar src="/src/assets/icon.png" sx={{ width: 32, height: 32 }} />
                                <Box>
                                    <Typography color="#fff" fontWeight="bold">{sampleUser.name}</Typography>
                                    <Typography fontSize={12} color="#888">{sampleUser.tag} | {sampleUser.school}</Typography>
                                </Box>
                                <Button size="small" sx={{ ml: 'auto', color: '#aaa', backgroundColor: '#3b3c4f', px: 2 }}>나가기</Button>
                            </Box>
                            <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
                                <Typography align="center" fontSize={12} color="#888" mb={1}>2025년 4월 3일</Typography>
                                <Typography align="center" fontSize={12} color="#666" mb={2}>채팅방이 생성되었습니다.</Typography>

                                <Box display="flex" justifyContent="flex-start" mb={1}>
                                    <Box sx={{ backgroundColor: '#3b3c4f', color: '#fff', px: 2, py: 1, borderRadius: 2, maxWidth: '70%' }}>
                                        저 유미장인
                                    </Box>
                                </Box>

                                <Box display="flex" justifyContent="flex-end" mb={1}>
                                    <Box sx={{ backgroundColor: '#fff', color: '#000', px: 2, py: 1, borderRadius: 2, maxWidth: '70%' }}>
                                        듀오 ㄱㄱㄱㄱ
                                    </Box>
                                </Box>

                                <Typography align="center" fontSize={12} color="#666" mt={2}>듀오가 당신의 평점을 등록하였습니다.</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #3b3c4f', backgroundColor: '#1e1f2d' }}>
                                <TextField
                                    fullWidth
                                    placeholder="내용을 입력해주세요.."
                                    variant="standard"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    InputProps={{ disableUnderline: true, sx: { color: '#fff', pl: 2 } }}
                                    sx={{ backgroundColor: '#2c2c3a', borderRadius: 2 }}
                                />
                                <IconButton sx={{ color: '#42E6B5', ml: 1 }}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </TabPanel>
            </Container>
        </Box>
    );
}
