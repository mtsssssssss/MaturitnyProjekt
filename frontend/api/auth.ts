import api from "./axios";
import { LoginDto, RegisterDto, User } from "@/types/api/auth";

export const login = async (data: LoginDto): Promise<void> => {
  await api.post("/auth/login", data);
};

export const register = async (data: RegisterDto): Promise<void> => {
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
