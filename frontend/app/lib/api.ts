import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('forceLogout'));
    }
    return Promise.reject(error);
  }
);

export const postData = async (url: string, data: any) => {
  try {
    const response = await api.post(url, data);
    console.log(BASE_URL,url)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getData = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateData = async (url: string, data: any) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (url: string) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};