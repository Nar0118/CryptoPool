import { GeneralResponse } from '.';
import { UserRoles } from 'utils/constants/userRoles';

export enum AuthProviders {
  BASIC = 'basic',
  GOOGLE = 'google',
}

export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role?: UserRoles;
}

export interface AdminResponse extends GeneralResponse {
  data?: Admin;
}

export interface AdminAllDataResponse extends GeneralResponse {
  data?: Array<Admin>;
}
