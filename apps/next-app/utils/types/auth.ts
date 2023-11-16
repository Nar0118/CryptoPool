import { User } from 'utils/model/user';

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
  user?: User;
}

export interface GeneralResponse {
  success: boolean;
  count?: number;
  error?: string;
}
