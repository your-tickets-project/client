import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'client/store/reducers/auth';
import appReducer from 'client/store/reducers/app';

export const store = configureStore({
  reducer: { auth: authReducer, app: appReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
