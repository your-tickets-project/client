import { AxiosResponse } from 'axios';
import API from './index';
import { UserType } from 'interfaces';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const checkUser = async (): Promise<AxiosResponse<{ user: UserType }>> =>
  API.get('/auth/check-user');

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const signup = async (
  data: unknown
): Promise<AxiosResponse<{ message: string }>> =>
  API.post('/auth/signup', data);

export const login = async (
  data: unknown
): Promise<
  AxiosResponse<{ accessToken: string; message: string; user: UserType }>
> => API.post('/auth/login', data);
