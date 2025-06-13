import React, { useState } from 'react';

import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';

import { CalendarView, MainCalendarProps, CalendarEvent } from '@/types/calendar';

export default function MainCalendar({
  events = [],
  onEventClick,
  onDateClick,
  defaultView = 'month',
}: MainCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(defaultView);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />
      <div className="flex-1 overflow-auto">
        {view === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onDateClick={onDateClick}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onDateClick={onDateClick}
          />
        )}
      </div>
    </div>
  );
}
