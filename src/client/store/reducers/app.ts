import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const getState = () => {
  const state = { isShowingDashboardOptions: false, canPublishEvent: false };

  if (process.env.NODE_ENV === 'test') {
    state.canPublishEvent = true;
  }

  return state;
};

export const appSlice = createSlice({
  name: 'app',
  initialState: getState(),
  reducers: {
    showDashboardOptions: (state, action: PayloadAction<boolean>) => {
      state.isShowingDashboardOptions = action.payload;
    },
    publishEvent: (state, action: PayloadAction<boolean>) => {
      state.canPublishEvent = action.payload;
    },
  },
});

export default appSlice.reducer;
