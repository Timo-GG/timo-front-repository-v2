import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      userData: {},
      accessToken: '',
      refreshToken: '',
      isEmailVerified: false,
      isSummonerVerified: false,

      // 로그인 관련
      login: (accessToken, refreshToken) =>
        set({
          isLoggedIn: true,
          accessToken,
          refreshToken,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          userData: {},
          accessToken: '',
          refreshToken: '',
          isEmailVerified: false,
          isSummonerVerified: false,
        }),

      // 사용자 정보 관련
      setUserData: (userData) => set({ userData }),
      setUserDataValue: (key, value) =>
        set((state) => ({
          userData: {
            ...state.userData,
            [key]: value,
          },
        })),

      // 토큰 관련
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),

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
