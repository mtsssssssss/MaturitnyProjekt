import api from "./axios";
import {
  UserListItem,
  UpdateUserRoleDto,
  UpdateUserPasswordDto,
} from "@/types/api/users";

export const getUsers = async (): Promise<UserListItem[]> => {
  const { data } = await api.get<UserListItem[]>("/User");
  return data;
};

export const updateUserRole = async (
  id: string,
  dto: UpdateUserRoleDto
): Promise<void> => {
  await api.put(`/User/${id}/role`, dto);
};

export const updateUserPassword = async (
  id: string,
  dto: UpdateUserPasswordDto
): Promise<void> => {
  await api.put(`/User/${id}/password`, dto);
};

