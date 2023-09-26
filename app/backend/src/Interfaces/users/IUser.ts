import { Identifiable } from '..';

export interface IUser extends Identifiable {
  email: string;
  password: string;
  role: string;
  username: string;
}

export type IUserResponse = Omit<IUser, 'password'>;
