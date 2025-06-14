import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Event } from '@/types/event';
import { loadEventsFromStorage, saveEventsToStorage } from '@/utils/storage';

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
}

const initialState: EventState = {
  events: loadEventsFromStorage(),
  selectedEvent: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
      saveEventsToStorage(state.events);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
        saveEventsToStorage(state.events);
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((event) => event.id !== action.payload);
      saveEventsToStorage(state.events);
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
  },
});

export const { addEvent, updateEvent, deleteEvent, setSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;
