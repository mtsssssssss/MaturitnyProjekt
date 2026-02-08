import api from "./axios";
import { Login, Register, User, FullUser } from "@/types/api/auth";

export const login = async (data: Login): Promise<void> => {
  await api.post("/auth/login", data);
};

export const register = async (data: Register): Promise<void> => {
  await api.post("/auth/register", data);
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/auth/me");
  return data;
};

export const refreshToken = async (): Promise<void> => {
  await api.post("/auth/refresh-token");
};

export const getFullUserInfo = async (): Promise<FullUser> => {
  const { data } = await api.get<FullUser>("/auth/full-user-info");
  return data;
};
