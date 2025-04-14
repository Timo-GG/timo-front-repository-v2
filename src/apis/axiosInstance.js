import axios from 'axios';
import useAuthStore from '../storage/useAuthStore';
import { refreshToken as refreshTokenAPI } from './authAPI';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    console.log('[axiosInterceptor]', { withAuth: config.withAuth, token });

    const customConfig = config; // 타입 안정성 고려 시 config as any 또는 config as CustomConfig

    if (customConfig.withAuth && token) {
        customConfig.headers = {
            ...customConfig.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return customConfig;
});

// 🔁 중복 요청 방지용 상태 관리
let isRefreshing = false;
let refreshSubscribers = [];

function onAccessTokenFetched(newToken) {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

// ✅ 응답 인터셉터: accessToken 만료 대응
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 조건: 401 에러 + 한 번도 재시도하지 않은 요청
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const authStore = useAuthStore.getState();

            if (isRefreshing) {
                // 다른 요청이 재발급 중이면 대기
                return new Promise((resolve) => {
                    addRefreshSubscriber((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const newAccessToken = await refreshTokenAPI(); // ✅ 아래에 정의됨
                onAccessTokenFetched(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest); // ✅ 재요청
            } catch (refreshErr) {
                // 재발급도 실패 → 로그아웃
                authStore.logout();
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/';
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
