import axios, { CanceledError, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
export { CanceledError };

const apiClient = axios.create({
    baseURL: "http://localhost:3060",
});

apiClient.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:3060/auth/refresh', { refreshToken });
                    const { accessToken, refreshToken: newRefreshToken,_id } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    localStorage.setItem('userId',_id );

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    console.error('Refresh token expired or invalid', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userId');

                    window.location.href = '/login'; // Redirect to login page
                }
            } else {
                window.location.href = '/login'; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;