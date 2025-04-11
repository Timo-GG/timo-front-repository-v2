import axiosInstance from './axiosInstance';
import useAuthStore from '../storage/useAuthStore';


export const verifyAccount = async ({ accountName, tagLine }) => {
    const response = await axiosInstance.get(
        `/members/player/verify?gameName=${encodeURIComponent(accountName)}&tagLine=${encodeURIComponent(tagLine)}`,
        { withAuth: true }
    );
    return response.data;
};