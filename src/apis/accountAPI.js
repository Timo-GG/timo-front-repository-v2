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
  return axiosInstance.post('/members/riot/reset', {
    withAuth: true,
  });
};