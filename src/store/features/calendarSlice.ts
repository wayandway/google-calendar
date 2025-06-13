import { format } from 'date-fns';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CalendarState, CalendarView } from '@/types/calendar';

const initialState: CalendarState = {
  currentDate: new Date(),
  view: 'month',
  selectedDate: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<Date>) => {
      state.currentDate = action.payload;
    },
    setView: (state, action: PayloadAction<CalendarView>) => {
      state.view = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<Date | null>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { setCurrentDate, setView, setSelectedDate } = calendarSlice.actions;

export default calendarSlice.reducer;
