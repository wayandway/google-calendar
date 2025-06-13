import React from 'react';

import { CalendarEvent } from '@/types/calendar';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
}: MonthViewProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
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

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // 이전 달의 날짜들
    const prevMonthDays = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        prevMonthDays - i,
      );
      days.push(
        <div key={`prev-${i}`} className="p-2 min-h-[100px] border border-gray-200 bg-gray-50">
          <span className="text-gray-400">{prevMonthDays - i}</span>
        </div>,
      );
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isToday = new Date().toDateString() === date.toDateString();
      const dayEvents = getEventsForDate(date);

      days.push(
        <div
          key={i}
          className={`p-2 min-h-[100px] border border-gray-200 ${isToday ? 'bg-blue-50' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`${isToday ? 'font-bold text-blue-600' : ''}`}>{i}</span>
          </div>
          <div className="space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-1 text-xs rounded truncate cursor-pointer"
                style={{ backgroundColor: event.color || '#e2e8f0' }}
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
    }

    // 다음 달의 날짜들
    const remainingDays = 42 - (firstDay + daysInMonth); // 6주 * 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="p-2 min-h-[100px] border border-gray-200 bg-gray-50">
          <span className="text-gray-400">{i}</span>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
        <div key={day} className="p-2 text-center font-semibold bg-white border-b">
          {day}
        </div>
      ))}
      {renderCalendarDays()}
    </div>
  );
}
