import axios from "axios";
import {apiClient} from "./api-client";
import { CredentialResponse } from "@react-oauth/google";
import { BASE_URL } from "../config.ts";

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
  mode?: "Real Estate" | "Business" | "none"; 
}

export const register = (user: IUser) => {
  return new Promise<{ status: number; message: string }>((resolve, reject) => {
    apiClient
      .noauth.post("/auth/register", user)
      .then(async (response) => {
        await login(user);
        resolve({ status: response.status, message: response.data.message });
      })
      .catch((error) => {
        reject({ status: error.response.status, message: error.response.data.message });
      });
  });
};

export const login = async (user: IUser) => {
  try {
    const abortController = new AbortController();
    const credentials = { username: user.username, password: user.password }
    const response = await apiClient.noauth.post('/auth/login', credentials, { signal: abortController.signal });
    const { accessToken, refreshToken, _id, mode } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', _id);
    localStorage.setItem('mode', mode);

    return response.data;
  } catch (error: any) {
    console.error('Failed to login user -', error.response.data);
    throw error.response.data;
  }
}

export const googleSignin = (
  
  credentialResponse: CredentialResponse) => {
  return new Promise<{ status: number; message: string; accessToken?: string; refreshToken?: string }>((resolve, reject) => {
    axios
      .post<{ status: number; message: string; accessToken: string; refreshToken: string; _id: string }>(
        `${BASE_URL}/auth/google`,
        credentialResponse
      )
      .then((response) => {
        const { accessToken, refreshToken, _id } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", _id);
        resolve({ status: response.status, message: response.data.message, accessToken, refreshToken });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const getUser = async (userId: string): Promise<IUser> => {
  // const token = localStorage.getItem('accessToken');
  const response = await apiClient.noauth.get<IUser>(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId: string, updatedUser: Partial<IUser>) => {
  const abortController = new AbortController();
  const token = localStorage.getItem('accessToken');
  try {
    const response = await apiClient.auth.put(`/users/${userId}`, updatedUser, {
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
    await apiClient.noauth.post('/auth/logout', { refreshToken }, {
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

export default {  getUser,register, login, updateUser, logout };