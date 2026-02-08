export type User = {
  id: string;
  username: string;
  role?: string;
};

export type FullUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullname: string;
  role: string;
};

export type Login = {
  username: string;
  password: string;
};

export type Register = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};
