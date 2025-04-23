import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in the specified action types
        ignoredActions: ['auth/login/fulfilled'],
        // Ignore specific paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

export default store;