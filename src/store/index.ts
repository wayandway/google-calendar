import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import calendarReducer from './slices/calendarSlice';
import layoutReducer from './slices/layoutSlice';
import eventReducer from './slices/eventSlice';

const calendarPersistConfig = {
  key: 'calendar',
  storage,
  whitelist: ['view'],
};

const persistedCalendarReducer = persistReducer(calendarPersistConfig, calendarReducer);

export const store = configureStore({
  reducer: {
    calendar: persistedCalendarReducer,
    layout: layoutReducer,
    event: eventReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
