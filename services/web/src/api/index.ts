import LocalStorage from '@helpers/LocalStorage';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import camelcaseKeys from 'camelcase-keys';

const BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type ErrorResponse = AxiosError & {
  response: AxiosResponse<{
    statusCode: number;
    path: string;
    message: string;
  }>;
};

api.interceptors.response.use(
  (response) => {
    const unwrapped = response.data.data;
    return camelcaseKeys(unwrapped, { deep: true });
  },
  (error: ErrorResponse) => {
    const status = error.response?.status;

    if (status === 401) {
      LocalStorage.removeAccessToken();

      window.location.href = '/login';
    }

    return Promise.reject(error.response?.data?.message || error.message);
  },
);

api.interceptors.request.use((config) => {
  const token = LocalStorage.getAccessToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
