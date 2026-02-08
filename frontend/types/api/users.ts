export type UserListItem = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "User" | "Teacher" | "Admin" | string;
  createdAt: string;
};

export type UpdateUserRole = {
  role: number;
};

export type UpdateUserPassword = {
  newPassword: string;
};

