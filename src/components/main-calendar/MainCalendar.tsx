'use client';

import React, { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

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
  const { currentDate, view } = useSelector((state: RootState) => state.calendar);

  const handleDateClick = (date: Date) => {
    onDateClick?.(date);
  };

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (view === 'month') {
        if (e.deltaY < 0) {
          // 스크롤 위로 (이전 달)
          dispatch(moveToPrevMonth());
        } else {
          // 스크롤 아래로 (다음 달)
          dispatch(moveToNextMonth());
        }
      }
    },
    [dispatch, view],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto" onWheel={handleWheel}>
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
