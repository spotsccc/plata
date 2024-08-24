export type User = {
  id: number;
  username: string;
  email: string;
};

export type UserWithPassword = {
  password: string;
} & User;
