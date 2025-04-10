import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      userData: {},
      accessToken: '',
      refreshToken: '',
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
        }),
      setUserData: (userData) => set({ userData }),
      setUserDataValue: (key, value) =>
        set((state) => ({
          userData: {
            ...state.userData,
            [key]: value,
          },
        })),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
    }),
    {
      name: 'userInfoStorage', // localStorage key 이름
    }
  )
);

export default useAuthStore;
