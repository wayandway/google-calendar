import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Event } from '@/types/event';

interface EventState {
  events: Event[];
}

const initialState: EventState = {
  events: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      const eventId = action.payload.split('_')[0];
      state.events = state.events.filter((event) => event.id !== eventId);
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
