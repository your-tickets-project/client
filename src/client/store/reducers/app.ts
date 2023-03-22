import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: { isShowingDashboardOptions: false },
  reducers: {
    showDashboardOptions: (state, action: PayloadAction<boolean>) => {
      state.isShowingDashboardOptions = action.payload;
    },
  },
});

export default appSlice.reducer;
