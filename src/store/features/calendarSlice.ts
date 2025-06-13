import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CalendarView } from '@/types/calendar';

interface CalendarState {
  currentDate: string;
  selectedDate: string;
  view: CalendarView;
}

const today = new Date();
const initialState: CalendarState = {
  currentDate: today.toISOString(),
  selectedDate: today.toISOString(),
  view: 'month',
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setView(state, action: PayloadAction<CalendarView>) {
      state.view = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    moveToPrevMonth(state) {
      const currentDate = new Date(state.currentDate);
      currentDate.setMonth(currentDate.getMonth() - 1);
      state.currentDate = currentDate.toISOString();
    },
    moveToNextMonth(state) {
      const currentDate = new Date(state.currentDate);
      currentDate.setMonth(currentDate.getMonth() + 1);
      state.currentDate = currentDate.toISOString();
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

export const { setView, setSelectedDate, moveToPrevMonth, moveToNextMonth, moveToToday } =
  calendarSlice.actions;

export default calendarSlice.reducer;
