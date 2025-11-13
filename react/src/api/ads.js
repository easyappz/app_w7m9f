import instance from './axios';

export const listAds = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
  });
  const qs = searchParams.toString();
  const url = qs ? `/api/ads/?${qs}` : '/api/ads/';
  const { data } = await instance.get(url);
  return data;
};

export const getAd = async (id) => {
  const { data } = await instance.get(`/api/ads/${id}/`);
  return data;
};

export const createAd = async (payload) => {
  const { data } = await instance.post('/api/ads/', payload);
  return data;
};

export const updateAd = async (id, payload) => {
  const { data } = await instance.patch(`/api/ads/${id}/`, payload);
  return data;
};

export const deleteAd = async (id) => {
  await instance.delete(`/api/ads/${id}/`);
};
