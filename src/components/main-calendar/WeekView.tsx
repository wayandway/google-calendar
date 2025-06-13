import React from 'react';

import { CalendarEvent } from '@/types/calendar';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export default function WeekView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
}: WeekViewProps) {
  const getWeekDays = (date: Date) => {
    const days = [];
    const currentDay = date.getDay();
    const diff = date.getDate() - currentDay;

    for (let i = 0; i < 7; i++) {
      const day = new Date(date.getFullYear(), date.getMonth(), diff + i);
      days.push(day);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="grid grid-cols-8 h-full">
      {/* 시간 열 */}
      <div className="border-r">
        <div className="h-12 border-b" /> {/* 요일 헤더 공간 */}
        {hours.map((hour) => (
          <div key={hour} className="h-16 border-b p-1 text-sm text-gray-500">
            {hour.toString().padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* 요일별 열 */}
      {weekDays.map((date) => {
        const isToday = date.toDateString() === new Date().toDateString();
        const dayEvents = getEventsForDate(date);

        return (
          <div key={date.toISOString()} className="relative border-r">
            {/* 요일 헤더 */}
            <div className={`h-12 border-b p-2 text-center ${isToday ? 'bg-blue-50' : ''}`}>
              <div className="text-sm font-medium">
                {['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
              </div>
              <div className={`text-lg ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                {date.getDate()}
              </div>
            </div>

            {/* 시간 슬롯 */}
            <div className="relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b relative"
                  onClick={() => {
                    const clickedDate = new Date(date);
                    clickedDate.setHours(hour, 0, 0, 0);
                    onDateClick(clickedDate);
                  }}
                >
                  {/* 시간대별 이벤트 */}
                  {dayEvents
                    .filter((event) => {
                      const eventHour = new Date(event.start).getHours();
                      return eventHour === hour;
                    })
                    .map((event) => {
                      const startMinutes = new Date(event.start).getMinutes();
                      const endMinutes = new Date(event.end).getMinutes();
                      const duration = endMinutes - startMinutes;
                      const height = Math.max((duration / 60) * 100, 25); // 최소 25% 높이

                      return (
                        <div
                          key={event.id}
                          className="absolute left-0 right-0 mx-1 p-1 text-xs rounded cursor-pointer truncate"
                          style={{
                            top: `${(startMinutes / 60) * 100}%`,
                            height: `${height}%`,
                            backgroundColor: event.color || '#e2e8f0',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                        >
                          {event.title}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
