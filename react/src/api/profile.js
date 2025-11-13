import instance from './axios';

export const getMe = async () => {
  const { data } = await instance.get('/api/profile/me/');
  return data;
};

export const updateMe = async (payload) => {
  const { data } = await instance.patch('/api/profile/me/', payload);
  return data;
};
