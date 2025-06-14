'use client';

import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';

import { RootState } from '@/store';
import { setSelectedDate } from '@/store/slices/calendarSlice';
import { useDispatch } from 'react-redux';

export default function MiniCalendar() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { selectedDate } = useSelector((state: RootState) => state.calendar);

  const monthStart = startOfMonth(new Date(selectedDate));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (date: Date) => {
    dispatch(setSelectedDate(date.toISOString()));
  };

  return (
    <div ref={calendarRef} className="p-4">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="bg-white p-2 text-center font-semibold">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`bg-white p-2 text-center cursor-pointer ${
                !isCurrentMonth ? 'text-gray-400' : ''
              } ${isCurrentDay ? 'bg-blue-50' : ''}`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
