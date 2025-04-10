import { io } from 'socket.io-client';

const accessToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJJZCI6MSwiZXhwIjoxNzQ0MjAzNzE1fQ.Sce6Q-iYv05AIZ1fyIATLdt0zXkkTDiWE0x4oh66VvekooVMY_ejNyaYfe5KJ6Qjtw2_zzKQnfJ6W9sj_YXZMA';

const socket = io('wss://api.timo.kr', {
    transports: ['websocket'],
    query: { token: accessToken }, // ✅ 이렇게 쿼리 파라미터에 토큰 포함
});

export default socket;