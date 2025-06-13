import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import React from 'react';

import { WeekViewProps } from '@/types/calendar';

export default function WeekView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
}: WeekViewProps) {
  // currentDate를 기준으로 해당 주의 시작일(일요일)을 계산
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0: 일요일

  const renderWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayEvents = events.filter((event) => isSameDay(new Date(event.start), day));
      const isToday = isSameDay(day, new Date());

      days.push(
        <div key={i} className="flex-1 border-r last:border-r-0">
          <div className="p-2 text-center">
            <div className="text-sm font-medium">{format(day, 'E', { locale: ko })}</div>
            <div
              className={`flex items-center justify-center w-8 h-8 mx-auto rounded-full ${
                isToday ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>
          <div className="p-2">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="mb-1 p-1 text-sm bg-blue-100 rounded cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>,
      );
    }
    return days;
  };

  return (
    <div className="h-full">
      <div className="flex h-full">{renderWeekDays()}</div>
    </div>
  );
}
