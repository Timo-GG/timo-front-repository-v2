import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            isLoggedIn: false,
            userData: {},
            accessToken: '',
            refreshToken: '',
            isEmailVerified: false,
            isSummonerVerified: false,

            // 로그인 관련
            login: (accessToken, refreshToken) => {
                // localStorage에도 저장
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                set({
                    isLoggedIn: true,
                    accessToken,
                    refreshToken,
                });
            },

            logout: () => {
                // localStorage에서도 제거
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                set({
                    isLoggedIn: false,
                    userData: {},
                    accessToken: '',
                    refreshToken: '',
                    isEmailVerified: false,
                    isSummonerVerified: false,
                });
            },

            // 사용자 정보 관련
            setUserData: (userData) => set({ userData }),
            setUserDataValue: (key, value) =>
                set((state) => ({
                    userData: {
                        ...state.userData,
                        [key]: value,
                    },
                })),

            // 토큰 관련 (localStorage 동기화 포함)
            setAccessToken: (accessToken) => {
                localStorage.setItem('accessToken', accessToken);
                set({ accessToken });
            },

            setRefreshToken: (refreshToken) => {
                localStorage.setItem('refreshToken', refreshToken);
                set({ refreshToken });
            },

            // 토큰 업데이트 (갱신 시 사용)
            updateTokens: (accessToken, refreshToken) => {
                localStorage.setItem('accessToken', accessToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }

                set(state => ({
                    accessToken,
                    refreshToken: refreshToken || state.refreshToken,
                    isLoggedIn: true
                }));
            },

            // 앱 시작 시 토큰 복원
            initializeAuth: () => {
                const storedAccessToken = localStorage.getItem('accessToken');
                const storedRefreshToken = localStorage.getItem('refreshToken');

                if (storedAccessToken && storedRefreshToken) {
                    set({
                        accessToken: storedAccessToken,
                        refreshToken: storedRefreshToken,
                        isLoggedIn: true
                    });
                    return true;
                }
                return false;
            },

            // 인증 관련
            setEmailVerified: (value) => set({ isEmailVerified: value }),
            setSummonerVerified: (value) => set({ isSummonerVerified: value }),
        }),
        {
            name: 'userInfoStorage',
        }
    )
);

export default useAuthStore;
