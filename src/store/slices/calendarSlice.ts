import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '@/types/event';

export interface CalendarState {
  currentDate: string;
  selectedDate: string;
  view: 'month' | 'week';
  events: Event[];
}

const today = new Date();
const initialState: CalendarState = {
  currentDate: today.toISOString(),
  selectedDate: today.toISOString(),
  view: 'week',
  events: [],
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate(state, action: PayloadAction<string>) {
      state.currentDate = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
      state.currentDate = action.payload;
    },
    setView(state, action: PayloadAction<'month' | 'week'>) {
      state.view = action.payload;
    },
    moveToPrevMonth(state) {
      const date = new Date(state.currentDate);
      date.setMonth(date.getMonth() - 1);
      state.currentDate = date.toISOString();
    },
    moveToNextMonth(state) {
      const date = new Date(state.currentDate);
      date.setMonth(date.getMonth() + 1);
      state.currentDate = date.toISOString();
    },
    moveToToday() {
      const today = new Date();
      return {
        ...initialState,
        currentDate: today.toISOString(),
        selectedDate: today.toISOString(),
      };
    },
    addEvent(state, action: PayloadAction<Event>) {
      state.events.push(action.payload);
    },
    updateEvent(state, action: PayloadAction<Event>) {
      const index = state.events.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
  },
});

export const {
  setCurrentDate,
  setSelectedDate,
  setView,
  moveToPrevMonth,
  moveToNextMonth,
  moveToToday,
  addEvent,
  updateEvent,
  deleteEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;
