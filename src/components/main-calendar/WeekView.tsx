'use client';

import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';

import { RootState } from '@/store';
import { setSelectedDate } from '@/store/slices/calendarSlice';
import { useDispatch } from 'react-redux';
import { Event } from '@/types/event';

export default function WeekView() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { selectedDate, events } = useSelector((state: RootState) => state.calendar);

  const weekStart = startOfWeek(new Date(selectedDate), { locale: ko });
  const weekEnd = endOfWeek(weekStart, { locale: ko });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handleDateClick = (date: Date) => {
    dispatch(setSelectedDate(date.toISOString()));
  };

  return (
    <div ref={calendarRef} className="flex-1 p-4">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => {
          const isCurrentDay = isToday(day);
          const dayEvents = events.filter((event: Event) => {
            const eventDate = new Date(event.start);
            return isSameDay(eventDate, day);
          });

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`min-h-[100px] bg-white p-2 ${isCurrentDay ? 'bg-blue-50' : ''}`}
            >
              <div className="font-semibold">{format(day, 'E d', { locale: ko })}</div>
              <div className="mt-1">
                {dayEvents.map((event: Event) => (
                  <div
                    key={event.id}
                    className="text-sm p-1 mb-1 rounded truncate"
                    style={{ backgroundColor: event.color || '#e2e8f0' }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
