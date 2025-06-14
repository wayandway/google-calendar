import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import calendarReducer from './slices/calendarSlice';
import eventReducer from './slices/eventSlice';
import layoutReducer from './slices/layoutSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['calendar', 'events'],
};

const persistedCalendarReducer = persistReducer(persistConfig, calendarReducer);
const persistedEventReducer = persistReducer(persistConfig, eventReducer);
const persistedLayoutReducer = persistReducer(persistConfig, layoutReducer);

export const store = configureStore({
  reducer: {
    calendar: persistedCalendarReducer,
    events: persistedEventReducer,
    layout: persistedLayoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
