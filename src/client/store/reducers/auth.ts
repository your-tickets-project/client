import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserType } from 'interfaces';

export interface AuthTypes {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserType | null;
}

export const initialState: AuthTypes = {
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const getState = (): AuthTypes => {
  return {
    ...initialState,
    accessToken:
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null,
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: getState(),
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: UserType; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken);
    },
    checkUser: (state, action: PayloadAction<{ user: UserType }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.user = initialState.user;
      state.isAuthenticated = initialState.isAuthenticated;
      state.accessToken = initialState.accessToken;
      localStorage.removeItem('accessToken');
    },
    loading: (state) => {
      state.isLoading = false;
    },
  },
});

export default authSlice.reducer;
