import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CalendarState {
  currentDate: string;
  selectedDate: string;
  view: 'month' | 'week';
}

const today = new Date();
const initialState: CalendarState = {
  currentDate: today.toISOString(),
  selectedDate: today.toISOString(),
  view: 'week',
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
  },
});

export const {
  setCurrentDate,
  setSelectedDate,
  setView,
  moveToPrevMonth,
  moveToNextMonth,
  moveToToday,
} = calendarSlice.actions;

export default calendarSlice.reducer;
