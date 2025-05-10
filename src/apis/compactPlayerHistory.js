import axiosInstance from './axiosInstance';

/**
 * @param {{ gameName: string; tagLine: string; region?: string; }} dto
 * @returns {Promise<{rankInfo, most3Champ, last10Match}>}
 */
export const fetchCompactPlayerHistory = async (dto) => {
    const response = await axiosInstance.post('/riot/compactHistory', dto);
    const data = response.data.data;

    return {
        rankInfo: data.rankInfo,
        most3Champ: data.most3Champ,
        last10Match: data.last10Match,
    };
};