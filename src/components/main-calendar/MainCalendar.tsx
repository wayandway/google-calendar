'use client';

import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';

import { RootState } from '@/store';
import {
  setView,
  setSelectedDate,
  moveToPrevMonth,
  moveToNextMonth,
  moveToToday,
} from '@/store/features/calendarSlice';
import { CalendarView, MainCalendarProps } from '@/types/calendar';

export default function MainCalendar({
  events = [],
  onEventClick = () => {},
  onDateClick,
  defaultView = 'month',
}: MainCalendarProps) {
  const dispatch = useDispatch();
  const { view, currentDate } = useSelector((state: RootState) => state.calendar);

  const handleViewChange = (newView: CalendarView) => {
    dispatch(setView(newView));
  };

  const handleDateClick = (date: Date) => {
    dispatch(setSelectedDate(date.toISOString()));
    onDateClick?.(date);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={new Date(currentDate)}
        view={view}
        onPrevMonth={() => dispatch(moveToPrevMonth())}
        onNextMonth={() => dispatch(moveToNextMonth())}
        onToday={() => dispatch(moveToToday())}
        onViewChange={handleViewChange}
      />
      <div className="flex-1 overflow-auto">
        {view === 'month' ? (
          <MonthView
            currentDate={new Date(currentDate)}
            events={events}
            onEventClick={onEventClick}
            onDateClick={handleDateClick}
          />
        ) : (
          <WeekView
            currentDate={new Date(currentDate)}
            events={events}
            onEventClick={onEventClick}
            onDateClick={handleDateClick}
          />
        )}
      </div>
    </div>
  );
}
