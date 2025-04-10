import axiosInstance from './axiosInstance';
import useAuthStore from '../storage/useAuthStore';

// 소셜 로그인 처리
export const socialLogin = async (provider, authorizationCode, state) => {
    try {
        let response;

        switch (provider) {
            case 'kakao':
                response = await axiosInstance.post('/auth/kakao', {
                    authorizationCode,
                });
                break;
            case 'discord':
                response = await axiosInstance.post('/auth/discord', {
                    authorizationCode,
                });
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

        const realData = response.data.data;
        console.log('소셜 로그인 응답:', realData);
        const { accessToken, refreshToken, newUser } = realData;        

        // 토큰 저장
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        useAuthStore.setState({ accessToken, refreshToken });
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken)
        

        // ✅ isNewUser도 반환!
        return { accessToken, refreshToken, newUser };

    } catch (err) {
        console.error(`${provider} 로그인 실패:`, err);
        throw err;
    }
};

export const getMyInfo = async () => {
    const response = await axiosInstance.get('/members/me', { withAuth: true });
    return response.data;
};
