import api from "./axios";
import {
  UserListItem,
  UpdateUserRole,
  UpdateUserPassword,
} from "@/types/api/users";

export const getUsers = async (): Promise<UserListItem[]> => {
  const { data } = await api.get<UserListItem[]>("/User");
  return data;
};

export const updateUserRole = async (
  id: string,
  dto: UpdateUserRole,
): Promise<void> => {
  await api.put(`/User/${id}/role`, dto);
};

export const updateUserPassword = async (
  id: string,
  dto: UpdateUserPassword,
): Promise<void> => {
  await api.put(`/User/${id}/password`, dto);
};
