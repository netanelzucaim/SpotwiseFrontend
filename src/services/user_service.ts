import apiClient, { CanceledError } from "./api-client";

export { CanceledError }

export interface IUser {
    email?: string;
    username?: string;
    password: string;
    imgUrl?: string;
    phoneNumber?: string;
    fullName?: string;
    _id?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  export const register = (user: IUser) => {
    return new Promise<{ status: number; message: string }>((resolve, reject) => {
      apiClient
        .post("/auth/register", user)
        .then(async (response) => {
          await login(user);
          resolve({ status: response.status, message: response.data.message });
        })
        .catch((error) => {
          reject({ status: error.response.status, message: error.response.data.message });
        });
    });
  };

const login = async (user: IUser) => {
    const abortController = new AbortController();
    const credentials = { username: user.username, password: user.password }
    const response = await apiClient.post('/auth/login', credentials, { signal: abortController.signal });
    const { accessToken, refreshToken, _id } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', _id);
    return response.data;
}

const getUser = (userId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<IUser>(`/users/${userId}`, {
        signal: abortController.signal
    });
    return { request, abort: () => abortController.abort() };
}

const updateUser = async (userId: string, updatedUser: Partial<IUser>) => {
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