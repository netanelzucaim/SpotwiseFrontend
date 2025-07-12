import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    CanceledError,
    InternalAxiosRequestConfig,
  } from 'axios';
  import { BASE_URL } from '../config';

  export { CanceledError };

  const getAccessToken = () => localStorage.getItem('accessToken');
  const getRefreshToken = () => localStorage.getItem('refreshToken');

  const purgeAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  };

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  const noauth: AxiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  const auth: AxiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  async function handleTokenRefresh(originalRequest: any): Promise<AxiosResponse | void> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      purgeAuth();
      redirectToLogin();
      return;
    }

    try {
      const response = await noauth.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, _id } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('userId', _id);

      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      return auth(originalRequest);
    } catch (error) {
      console.error('Token refresh failed:', error);
      purgeAuth();
      redirectToLogin();
      throw error;
    }
  }

  auth.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  auth.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config;

      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        return handleTokenRefresh(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  export const apiClient = {
    noauth,
    auth,
  };