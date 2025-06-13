import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import React from 'react';

import { MonthViewProps } from '@/types/calendar';

export default function MonthView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const today = new Date();

  const renderCalendarDays = () => {
    const days = [];
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      const isCurrentMonth = isSameMonth(currentDate, monthStart);
      const isToday = isSameDay(currentDate, today);
      const dayEvents = events.filter((event) => isSameDay(new Date(event.start), currentDate));

      days.push(
        <div
          key={i}
          onClick={() => onDateClick(currentDate)}
          className={`flex-1 min-h-[100px] p-2 border-r border-b ${
            !isCurrentMonth ? 'bg-gray-50' : ''
          }`}
        >
          <div className="text-right">
            <div
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                isToday ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {format(currentDate, 'd')}
            </div>
          </div>
          <div className="mt-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="mb-1 p-1 text-sm bg-blue-100 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>,
      );
      startDate.setDate(startDate.getDate() + 1);
    }
    return days;
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="p-2 text-center font-medium bg-white">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
}
