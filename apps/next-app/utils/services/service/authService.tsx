import { Context } from 'react';
import { ContextProps } from 'types/user';
import { AuthResponse } from 'types/auth';
import { hashPassword } from 'utils';
import * as localStorage from 'utils/services/localStorageService';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import localStorageKeys from 'utils/constants/localStorageKeys';
import { axiosInstance } from 'utils/services/service/axiosService';
import { User } from 'utils/model/user';

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  signup(
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResponse>;
  changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResponse>;
  logout(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
  signupByGoogle(googleToken: string): Promise<AuthResponse>;
  loginByGoogle(googleToken: string): Promise<AuthResponse>;
  sendRecoverPasswordEmail(
    email: string
  ): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
  checkVerificationCode(
    emailVerificationCode: number,
    email: string | Array<string>
  ): Promise<{
    success: boolean;
    message?: string;
    user?: User;
  }>;
  updateForgottenPassword(
    password: string,
    email: string
  ): Promise<{
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
        const response = await axiosInstance.post('/users/login', {
          email,
          password: hashPassword(password),
        });

        const data = response?.data;
        if (data?.token) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.TOKEN_KEY,
            data.token
          );
        }

        return data;
      } catch (err) {
        console.log(err);
      }
    },

    async signupByGoogle(googleToken: string): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.post('/users/signup/google', {
          googleToken,
        });

        if (response.data.token) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.TOKEN_KEY,
            response.data.token
          );
        }

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async loginByGoogle(googleToken: string): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.post('/users/login/google', {
          googleToken,
        });

        if (response.data.token) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.TOKEN_KEY,
            response.data.token
          );
        }

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async signup(
      fullName: string,
      email: string,
      password: string
    ): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.post('/users/signup', {
          fullName,
          email,
          password: hashPassword(password),
        });
        if (response.data.token) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.TOKEN_KEY,
            response.data.token
          );
        }

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async changePassword(
      oldPassword: string,
      newPassword: string
    ): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.put('/users/change-password', {
          oldPassword: hashPassword(oldPassword),
          newPassword: hashPassword(newPassword),
        });

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async checkVerificationCode(
      emailVerificationCode: number,
      email: string
    ): Promise<{ success: boolean; message?: string; user?: User }> {
      try {
        const response = await axiosInstance.post('/users/check-mail', {
          emailVerificationCode,
          email,
        });

        return response.data;
      } catch (err) {
        console.log(err);
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

    async sendRecoverPasswordEmail(
      email: string
    ): Promise<{
      success: boolean;
      message?: string;
      error?: string;
    }> {
      try {
        const response = await axiosInstance.post('/users/recover-password', {
          email,
        });

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async updateForgottenPassword(
      password: string,
      email: string
    ): Promise<{
      success: boolean;
      message?: string;
      error?: string;
    }> {
      try {
        const response = await axiosInstance.put(
          `/users/update-forgotten-password`,
          {
            newPassword: hashPassword(password),
            email,
          }
        );

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
