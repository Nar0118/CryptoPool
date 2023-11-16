import { Context } from 'react';
import { AuthResponse } from 'types/authResponse';
import { Contextualizer } from '../contextualizer';
import { ProvidedServices } from '../providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';
import { hashPassword } from 'utils';
import { Admin, AdminResponse } from 'types/admin';

export interface IAdminService {
  getAllAdmins(
    limit?: number,
    offset?: number
  ): Promise<{
    data: Array<Admin>;
    count: number;
  }>;
  getCurrentAdmin(): Promise<AdminResponse>;
  updateAdmin(admin: Admin): Promise<AdminResponse>;
  deleteAdmin(id: string): Promise<AuthResponse>;
  createAdmin(
    fullName: string,
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message?: string;
    data?: AdminResponse;
  }>;
}

export const AdminServiceContext: Context<
  IAdminService | undefined
> = Contextualizer.createContext(ProvidedServices.AdminService);

export const useAdminServices = () =>
  Contextualizer.use<IAdminService>(ProvidedServices.AdminService);

export const AdminService = ({ children }: any) => {
  const adminService = {
    async getAllAdmins(
      limit: number = 0,
      offset: number = 0
    ): Promise<{
      data: Array<Admin>;
      count: number;
    }> {
      try {
        const response = await axiosInstance.get(
          `/admins?limit=${limit}&offset=${offset}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async updateAdmin(admin: Admin): Promise<AdminResponse> {
      try {
        const response = await axiosInstance.put(
          `/admins/update-admin/${admin._id}`,
          {
            fullName: admin.fullName,
            email: admin.email,
          }
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async deleteAdmin(id: string): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.delete(`/admins/${id}`);

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async createAdmin(
      fullName: string,
      email: string,
      password: string
    ): Promise<{
      success: boolean;
      message?: string;
      data?: AdminResponse;
    }> {
      try {
        const response = await axiosInstance.post('/admins', {
          fullName,
          email,
          password: hashPassword(password),
        });

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async getCurrentAdmin(): Promise<AdminResponse> {
      const response = await axiosInstance.get(`/admins/me`);

      return response.data;
    },
  };

  return (
    <AdminServiceContext.Provider value={adminService}>
      {children}
    </AdminServiceContext.Provider>
  );
};
