import { format } from 'date-fns';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CalendarState, ViewMode } from '@/types/calendar';

const initialState: CalendarState = {
  currentDate: format(new Date(), 'yyyy-MM-dd'),
  viewMode: 'week',
  selectedDate: null,
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { setCurrentDate, setViewMode, setSelectedDate } = calendarSlice.actions;

export default calendarSlice.reducer;
