import instance from './axios';

export const register = async (payload) => {
  const { data } = await instance.post('/api/auth/register/', payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await instance.post('/api/auth/login/', payload);
  return data; // { token, member }
};
