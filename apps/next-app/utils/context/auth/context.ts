import { createContext } from 'react';
import { User } from 'utils/model/user';

export interface AuthContext {
  path: string;
  authorized: boolean;
  user?: User;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);
