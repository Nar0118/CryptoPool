import { Admin } from './admin';

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
  admin?: Admin;
}
