import axios from 'axios';
import useAuthStore from '../storage/useAuthStore';
import { refreshToken as refreshTokenAPI } from './authAPI';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({

    baseURL: `${baseUrl}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🔁 중복 요청 방지용 상태 관리
let isRefreshing = false;
let failedQueue = [];

// 대기열 처리 함수
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 토큰 만료 체크 함수
const isTokenExpired = (token, bufferMinutes = 2) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const bufferTime = bufferMinutes * 60;
        return payload.exp < (currentTime + bufferTime);
    } catch (error) {
        return true;
    }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        if (config.withAuth) {
            // ✅ useAuthStore에서 토큰 가져오기 (localStorage 백업)
            const { accessToken } = useAuthStore.getState();
            const token = accessToken || localStorage.getItem('accessToken');

            console.log("요청 토큰:", token);

            if (token) {
                if (isTokenExpired(token)) {
                    console.log("토큰이 곧 만료됨, 갱신 필요");
                }

                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            } else {
                console.log("토큰이 없음 - 인증 필요");
                return Promise.reject(new Error('No authentication token available'));
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // ✅ useAuthStore에서 refreshToken 가져오기
                const { refreshToken } = useAuthStore.getState();

                if (!refreshToken) {
                    console.log("Refresh token이 없음");
                    throw new Error('No refresh token available');
                }

                console.log("토큰 갱신 시도 중...");

                const newAccessToken = await refreshTokenAPI();

                console.log("토큰 갱신 성공");

                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                console.error("토큰 갱신 실패:", refreshError);

                processQueue(refreshError, null);

                // ✅ useAuthStore의 logout 메서드 사용
                useAuthStore.getState().logout();

                // 커스텀 이벤트 발생
                window.dispatchEvent(new CustomEvent('authError', {
                    detail: {
                        message: 'Token refresh failed',
                        error: refreshError.message
                    }
                }));

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
