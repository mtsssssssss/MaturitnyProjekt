export type User = {
  id: string;
  username: string;
  role?: string;
};

export type LoginDto = {
  username: string;
  password: string;
};

export type RegisterDto = {
  username: string;
  password: string;
};
