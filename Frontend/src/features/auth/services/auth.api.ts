import axios from "axios";

type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export async function register(data: RegisterInput) {
  try {
    const response = await api.post(`/api/auth/register`, data);

    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err?.response?.data?.message || "Registration failed");
  }
}

export async function login(data: LoginInput) {
  try {
    const response = await api.post(`/api/auth/login`, data);

    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err?.response?.data?.message || "Login failed");
  }
}

export async function logout() {
  try {
    const response = await api.get(`/api/auth/logout`);

    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getMe() {
  try {
    const response = await api.get(`/api/auth/get-me`);

    return response.data;
  } catch (err) {
    console.error(err);
  }
}
