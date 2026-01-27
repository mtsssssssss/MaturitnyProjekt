export type UserListItem = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "User" | "Teacher" | "Admin" | string;
  createdAt: string;
};

export type UpdateUserRoleDto = {
  role: "User" | "Teacher" | "Admin";
};

export type UpdateUserPasswordDto = {
  newPassword: string;
};

