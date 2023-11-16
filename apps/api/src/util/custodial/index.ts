import axios, { AxiosRequestConfig } from 'axios';
import { PBPayConfigs } from '../constants/config';
import env from '../constants/env';

export const axiosInstance = axios.create({
  baseURL: env.custodialBaseUrl,
});

export const selfAxiosInstance = axios.create({
  baseURL: env.apiSelfBaseUrl,
});

export const pbPayAxiosInstance = axios.create({
  baseURL: PBPayConfigs.DOMAIN,
  headers: {
    Authorization: `Bearer ${PBPayConfigs.AUTH_TOKEN}`,
  },
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

selfAxiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
