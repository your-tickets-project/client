/* eslint-disable no-param-reassign */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from 'client/store';

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
  if (accessToken) {
    // @ts-ignore
    options.headers!.Authorization = `Bearer ${accessToken}`;
  }
  return options;
};

const successResponseInterceptor = (response: AxiosResponse) => response;

http.interceptors.request.use(requestInterceptor);
http.interceptors.response.use(successResponseInterceptor);

export default http;
