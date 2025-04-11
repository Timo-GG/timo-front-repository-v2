import axiosInstance from './axiosInstance';

export const requestUnivVerification = async ({ univName, univEmail }) => {
  const response = await axiosInstance.post('/auth/univ/request', {
    univName,
    univEmail,
  });
  return response.data;
};

export const verifyUnivCode = async (code, { univName, univEmail }) => {
  const response = await axiosInstance.post(`/auth/univ/verify?code=${code}`, {
    univName,
    univEmail,
  });
  return response.data;
};

export const checkUniv = async ({ univName }) => {
  const response = await axiosInstance.post('/auth/univ/checkUniv', {
    univName
  });
  return response.data;
};