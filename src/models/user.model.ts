export interface User {
  id: string;
  email: string;
  created_at: string;
  role?: 'user' | 'admin';
}

export type CreateUserDto = Omit<User, 'id' | 'created_at'> & {
  password: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;