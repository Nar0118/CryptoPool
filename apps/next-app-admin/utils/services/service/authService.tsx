import { Context } from 'react';
import { hashPassword } from 'utils';
import { axiosInstance } from 'utils/services/service/axiosService';
import { ContextProps } from 'types/user';
import { AuthResponse } from 'types/authResponse';
import * as localStorage from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  signup(
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResponse>;
  logout(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
}

export const AuthServiceContext: Context<
  IAuthService | undefined
> = Contextualizer.createContext(ProvidedServices.AuthService);

export const useAuthServices = (): IAuthService =>
  Contextualizer.use<IAuthService>(ProvidedServices.AuthService);

export const AuthService = ({ children }: ContextProps): JSX.Element => {
  const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.post('/admins/login', {
          email,
          password: hashPassword(password),
        });

        if (response.data.success && response.data.token) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.TOKEN_KEY,
            response.data.token
          );
        }

        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    },

    async signup(
      fullName: string,
      email: string,
      password: string
    ): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.post('/admins/signup', {
          fullName,
          email,
          password: hashPassword(password),
        });

        if (response.data.success && response.data.token) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.TOKEN_KEY,
            response.data.token
          );
        }

        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    },

    async logout(): Promise<{
      success: boolean;
      message?: string;
      error?: string;
    }> {
      try {
        const response = await axiosInstance.post('/users/logout');

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <AuthServiceContext.Provider value={authService}>
      {children}
    </AuthServiceContext.Provider>
  );
};
