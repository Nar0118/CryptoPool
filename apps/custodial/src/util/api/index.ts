import axios from 'axios';
import { PBPayConfigs } from '../constants/config';
import env from '../constants/env';

export const apiAxiosInsance = axios.create({
  baseURL: env.nextPublicApiBaseUrl,
});

export const pbPayAxiosInstance = axios.create({
  baseURL: PBPayConfigs.DOMAIN,
  headers: {
    Authorization: `Bearer ${PBPayConfigs.AUTH_TOKEN}`,
  },
});
