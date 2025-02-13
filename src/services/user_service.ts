import apiClient, { CanceledError } from "./api-client";

export { CanceledError }

export interface User {
    _id?: string,
    username: string,
    password?: string,
    avatar?: string
}

const register = async (user: User) => {
    const abortController = new AbortController();
    const request = await apiClient.post('/auth/register', user, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
}

const login = async (user: User) => {
    const abortController = new AbortController();
    const response = await apiClient.post('/auth/login', user, { signal: abortController.signal });
    const { accessToken, refreshToken, _id } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', _id);
    return response.data;
}

const getUser = (userId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<User>(`/users/${userId}`, {
        signal: abortController.signal
    });
    return { request, abort: () => abortController.abort() };
}

const updateUser = async (userId: string, updatedUser: Partial<User>) => {
    const abortController = new AbortController();
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.put(`/users/${userId}`, updatedUser, {
            signal: abortController.signal,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { data: response.data, abort: () => abortController.abort() };
    } catch (error) {
        console.error('Failed to update user', error);
        throw error;
    }
}

const logout = async () => {
    const abortController = new AbortController();
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error("No refresh token found");
    }
    try {
        await apiClient.post('/auth/logout', { refreshToken }, {
            signal: abortController.signal,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
    } catch (error) {
        console.error('Failed to logout', error);
        throw error;
    }
}

export default { register, login, getUser, updateUser, logout };