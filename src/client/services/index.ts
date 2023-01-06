/* eslint-disable no-param-reassign */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from 'client/store';
// import { logoutAction, refreshTokenAction } from 'store/actions/auth';
// import { clearAppAction } from 'store/actions/app';
// import { refreshToken } from './auth';
// import jwt_decode from 'jwt-decode';

const HOST = process.env.NEXT_PUBLIC_BASE_URL;
const PATH = process.env.NEXT_PUBLIC_API_PATH;

export const baseURL = `${HOST}${PATH}`;

// const timeout = 3_600;

const defaultOptions = {
  baseURL,
};

const http = axios.create(defaultOptions);

const requestInterceptor = async (options: AxiosRequestConfig) => {
  const { accessToken } = store.getState().auth;
  // if (accessToken && !options.url?.includes('refresh-token')) {
  //   const decoded = jwt_decode<{ exp: number }>(accessToken);
  //   const current = new Date();
  //   const expiration = new Date(decoded.exp * 1_000);
  //   const isExpired = current.getTime() >= expiration.getTime();
  //   if (isExpired) {
  //     accessToken = await getRefreshedToken();
  //   }
  // }
  if (accessToken) {
    // @ts-ignore
    options.headers!.Authorization = `Bearer ${accessToken}`;
  }
  return options;
};

const successResponseInterceptor = (response: AxiosResponse) => response;

// const getRefreshedToken = async () => {
//   try {
//     const { accessToken } = store.getState().auth;
//     const res = await refreshToken(accessToken);
//     if (res.data?.accessToken) {
//       refreshTokenAction(res.data.accessToken);
//       return res.data.accessToken;
//     }
//     return null;
//   } catch (err) {
//     return null;
//   }
// };

// const logout = () => {
//   setTimeout(() => {
//     clearAppAction();
//     logoutAction();
//   });
// };

// const errorResponseInterceptor = async (err: AxiosError) => {
//   const inRefreshToken = err?.config?.url?.includes('refresh-token');
//   if (inRefreshToken) {
//     logout();
//   }
//   return Promise.reject(err);
// };

http.interceptors.request.use(requestInterceptor);
http.interceptors.response.use(
  successResponseInterceptor
  // errorResponseInterceptor
);

export default http;
