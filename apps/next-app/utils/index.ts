import * as bcrypt from 'bcryptjs';

export const isPromise = (p: any): boolean => {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
};

export const returnsPromise = (f: any): boolean => {
  if (
    f.constructor.name === 'AsyncFunction' ||
    (typeof f === 'function' && isPromise(f()))
  ) {
    return true;
  }
  return false;
};

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u');
};
