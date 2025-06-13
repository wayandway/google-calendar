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
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0: 일요일

  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      timeSlots.push(
        <div key={hour} className="flex h-16 border-b">
          <div className="w-20 p-2 text-sm text-gray-500 border-r">
            {format(new Date().setHours(hour, 0, 0, 0), 'a h시', { locale: ko })}
          </div>
          <div className="flex-1 grid grid-cols-7">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const day = addDays(weekStart, dayIndex);
              const dayEvents = events.filter((event) => {
                const eventDate = new Date(event.start);
                return isSameDay(eventDate, day) && eventDate.getHours() === hour;
              });

              return (
                <div key={dayIndex} className="border-r last:border-r-0 relative">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0 mx-1 p-1 text-xs bg-blue-100 rounded cursor-pointer"
                      onClick={() => onEventClick(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>,
      );
    }
    return timeSlots;
  };

  const renderWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
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
        </div>,
      );
    }
    return days;
  };

  return (
    <div className="h-full">
      <div className="flex border-b">
        <div className="w-20 border-r" />
        {renderWeekDays()}
      </div>
      <div className="overflow-y-auto">{renderTimeSlots()}</div>
    </div>
  );
}
