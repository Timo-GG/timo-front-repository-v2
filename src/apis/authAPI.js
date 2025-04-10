import axiosInstance from './axiosInstance';


export const testToken = async ({ accessToken, refreshToken }) => {
    const res = await axiosInstance.get('/auth/test', {
        accessToken,
        refreshToken,
    });
    return res.data;
};