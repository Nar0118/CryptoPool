import { sign } from 'jsonwebtoken'
import { createHash } from 'crypto'
import env from "./constants/env";

const SECRET_JWT_CODE = env.secretJwtCode;

export const generateKey = (email) => {
  const secretKey = SECRET_JWT_CODE

  const payload = {
    email
  };
  const token = sign(payload, secretKey);
  const hashedToken = createHash('sha256').update(token).digest('hex');

  return hashedToken.substring(0, 30);
};
