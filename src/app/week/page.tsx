'use client';

import { useState } from 'react';

import { MainCalendar } from '@/components/main-calendar';
import type { CalendarEvent } from '@/types/calendar';

export default function WeekPage() {
  const [_events, setEvents] = useState<CalendarEvent[]>([]);

  const handleEventClick = (event: CalendarEvent) => {
    // TODO: 이벤트 상세 모달 표시
    setEvents((prev) => [...prev, event]); // 임시로 이벤트 추가
  };

  const handleDateClick = (date: Date) => {
    // TODO: 이벤트 생성 모달 표시
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: '새 이벤트',
      start: date,
      end: new Date(date.getTime() + 60 * 60 * 1000), // 1시간 후
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <main className="flex-1 h-[calc(100vh-64px)]">
      <MainCalendar
        events={_events}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
        defaultView="week"
      />
    </main>
  );
}
