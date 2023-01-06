import { AxiosResponse } from 'axios';
import { UserType } from 'interfaces';
import API from './index';

export const signin = async (
  data: unknown
): Promise<AxiosResponse<{ message: string }>> =>
  API.post('/auth/signin', data);

export const login = async (
  data: unknown
): Promise<
  AxiosResponse<{ accessToken: string; message: string; user: UserType }>
> => API.post('/auth/login', data);

export const checkUser = async (): Promise<AxiosResponse<{ user: UserType }>> =>
  API.get('/auth/check-user');
