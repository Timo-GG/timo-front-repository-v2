import axios from 'axios';
import axiosInstance from './axiosInstance';
import useAuthStore from '../storage/useAuthStore';

// 소셜 로그인 처리
export const socialLogin = async (provider, authorizationCode, state) => {
    try {
        let response;

        switch (provider) {
            case 'kakao':
                response = await axiosInstance.post('/auth/kakao', { authorizationCode });
                break;
            case 'discord':
                response = await axiosInstance.post('/auth/discord', { authorizationCode });
                break;
            case 'naver':
                response = await axiosInstance.post('/auth/naver', {
                    authorizationCode,
                    state,
                });
                break;
            default:
                throw new Error('지원하지 않는 provider입니다.');
        }

        const realData = response.data?.data || response.data;
        if (!realData) throw new Error(`${provider} 로그인 실패: 응답 데이터가 비어 있습니다.`);

        const { accessToken, refreshToken, newUser } = realData;

        // ✅ useAuthStore의 login 메서드 사용
        useAuthStore.getState().login(accessToken, refreshToken);

        return { accessToken, refreshToken, newUser };
    } catch (err) {
        console.error(`${provider} 로그인 실패:`, err);
        throw err;
    }
};

// 🔄 AccessToken 재발급
export async function refreshToken() {
    const { accessToken, refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const res = await axios.post('http://localhost:8080/api/v1/auth/refresh', null, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Refresh-Token': `Bearer ${refreshToken}`,
        },
    });

    const newAccessToken = res.data.data?.accessToken || res.data.accessToken;
    const newRefreshToken = res.data.data?.refreshToken || res.data.refreshToken;

    // ✅ useAuthStore의 updateTokens 메서드 사용
    useAuthStore.getState().updateTokens(newAccessToken, newRefreshToken);

    return newAccessToken;
}

// 내 정보 조회
export const getMyInfo = async () => {
    const response = await axiosInstance.get('/members/me', { withAuth: true });
    return response.data;
};
