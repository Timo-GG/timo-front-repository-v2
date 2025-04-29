import axiosInstance from './axiosInstance';


export const verifyAccount = async ({ accountName, tagLine }) => {
  const response = await axiosInstance.post(
    '/members/player/verify',
    {
      gameName: accountName,
      tagLine: tagLine,
    },
    {withAuth: true}
  );
  return response.data;
};

export const updateUsername = async (newName) => {
  const res = await axiosInstance.put("/members/username", newName, {
    withAuth: true,
    headers: { 'Content-Type': 'text/plain' },
  });
  return res.data;
};

export const resetRiotAccount = () => {
  return axiosInstance.post('/members/riot/reset', null,{
    withAuth: true,
  });
};

export const registerRanking = async (puuid) => {
  const res = await axiosInstance.post(
      '/ranking', // "/api/v1"는 이미 axiosInstance에 베이스 URL로 있을 것으로 가정
      null,
      {
        params: { puuid },
        withAuth: true,
      }
  );
  return res.data;
};
