'use client';

import {
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import React, { useState } from 'react';

import { EventListModal } from '@/components/modal/EventListModal';
import { MonthViewProps } from '@/types/calendar';
import { Event } from '@/types/event';
import { getEventsForDateRange } from '@/utils/recurrence';

export default function MonthView({
  currentDate,
  events = [],
  onEventClick,
  onDateClick,
  onDateRangeSelect,
  selectedRange,
}: MonthViewProps) {
  const [dragStartDate, setDragStartDate] = useState<Date | null>(null);
  const [dragEndDate, setDragEndDate] = useState<Date | null>(null);
  const [showEventList, setShowEventList] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleDateClick = (date: Date, e: React.MouseEvent) => {
    // 이벤트 목록 모달이 열려있으면 날짜 클릭 무시
    if (showEventList) {
      return;
    }
    onDateClick?.(date, e);
  };

  const handleMouseDown = (date: Date, event: React.MouseEvent) => {
    // 이전 선택 상태 초기화
    setSelectedDate(null);
    setDragStartDate(null);
    setDragEndDate(null);

    setDragStartDate(date);
    setDragEndDate(date);
    event.currentTarget.classList.add('bg-blue-100');
  };

  const handleMouseEnter = (date: Date) => {
    if (dragStartDate) {
      setDragEndDate(date);
    }
  };

  const handleMouseUp = () => {
    if (dragStartDate && dragEndDate) {
      const start = dragStartDate < dragEndDate ? dragStartDate : dragEndDate;
      const end = dragStartDate < dragEndDate ? dragEndDate : dragStartDate;
      onDateRangeSelect?.(start, end);
    }
    // 드래그 상태 초기화
    setDragStartDate(null);
    setDragEndDate(null);
  };

  const isInDragRange = (date: Date) => {
    // 드래그 중일 때
    if (dragStartDate && dragEndDate) {
      const start = dragStartDate < dragEndDate ? dragStartDate : dragEndDate;
      const end = dragStartDate < dragEndDate ? dragEndDate : dragStartDate;
      return isWithinInterval(date, { start, end });
    }

    // 드래그가 끝난 후 선택된 범위
    if (selectedRange) {
      return isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end });
    }

    return false;
  };

  const handleMoreClick = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.currentTarget as globalThis.HTMLElement;
    const rect = target.getBoundingClientRect();
    setSelectedDate(date);
    setModalPosition({ x: rect.left, y: rect.top });
    setShowEventList(true);
  };

  const handleEventListClose = () => {
    setShowEventList(false);
    setSelectedDate(null);
  };

  const handleEventListEventClick = (
    event: Event,
    clickEvent: React.MouseEvent,
    position?: { x: number; y: number },
  ) => {
    onEventClick?.(event, clickEvent, position);
  };

  const renderCalendarDays = () => {
    const days = [];
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const startDay = startDate.getDay();
    const totalDays = endDate.getDate();

    // 이전 달의 날짜들
    const prevMonthStart = startOfWeek(startDate);
    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(startDate);
      prevDate.setDate(prevDate.getDate() - (startDay - i));
      days.push(
        <div
          key={prevDate.toISOString()}
          className="flex-1 min-h-[100px] p-2 border-r border-b bg-gray-50"
        >
          <div className="text-right text-gray-400">{format(prevDate, 'd')}</div>
        </div>,
      );
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(i);
      const isCurrentMonth = isSameMonth(currentDate, startDate);
      const isInRange = isInDragRange(currentDate);

      // 해당 날짜의 이벤트들을 가져옴 (반복 일정 포함)
      const dayEvents = getEventsForDateRange(events, prevMonthStart, endOfWeek(endDate));

      days.push(
        <div
          key={currentDate.toISOString()}
          className={`flex-1 min-h-[100px] p-2 border-r border-b cursor-pointer ${
            !isCurrentMonth ? 'bg-gray-50' : ''
          } ${isInRange ? 'bg-blue-100' : ''}`}
          data-date={currentDate.toISOString().split('T')[0]}
          onMouseDown={(e) => {
            if (
              (e.target as globalThis.HTMLElement).closest('.event-item') ||
              (e.target as globalThis.HTMLElement).closest('.more-events')
            ) {
              e.stopPropagation();
              return;
            }
            handleMouseDown(currentDate, e);
          }}
          onMouseEnter={() => handleMouseEnter(currentDate)}
          onMouseUp={handleMouseUp}
          onClick={(e) => {
            if (
              (e.target as globalThis.HTMLElement).closest('.event-item') ||
              (e.target as globalThis.HTMLElement).closest('.more-events')
            ) {
              e.stopPropagation();
              return;
            }
            handleDateClick(currentDate, e);
          }}
        >
          <div className="text-right">
            <span
              className={`inline-block w-8 h-8 leading-8 text-center rounded-full ${
                isSameDay(currentDate, new Date()) ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {format(currentDate, 'd')}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents
              .filter((event) => {
                const eventDate = new Date(event.start);
                return isSameDay(eventDate, currentDate);
              })
              .slice(0, 3)
              .map((event) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                const isMultiDay = !isSameDay(eventStart, eventEnd);
                const isFirstDay = isSameDay(eventStart, currentDate);

                return (
                  <div
                    key={event.id}
                    className={`event-item p-1 text-xs rounded cursor-pointer truncate ${
                      isMultiDay ? 'bg-blue-100 border-l-4' : 'bg-blue-100'
                    }`}
                    style={{
                      borderLeftColor: event.color || '#3b82f6',
                      backgroundColor: event.color ? `${event.color}20` : '#3b82f620',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event, e);
                    }}
                  >
                    {isFirstDay && event.title}
                  </div>
                );
              })}
            {dayEvents.filter((event) => {
              const eventDate = new Date(event.start);
              return isSameDay(eventDate, currentDate);
            }).length > 3 && (
              <div
                className="more-events text-xs text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleMoreClick(currentDate, e);
                }}
              >
                {dayEvents.filter((event) => {
                  const eventDate = new Date(event.start);
                  return isSameDay(eventDate, currentDate);
                }).length - 3}{' '}
                개 더보기
              </div>
            )}
          </div>
        </div>,
      );
    }

    // 다음 달의 날짜들
    const remainingDays = 42 - (startDay + totalDays); // 6주 * 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(endDate);
      nextDate.setDate(nextDate.getDate() + i);
      days.push(
        <div
          key={nextDate.toISOString()}
          className="flex-1 min-h-[100px] p-2 border-r border-b bg-gray-50"
        >
          <div className="text-right text-gray-500">{format(nextDate, 'd')}</div>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-7 h-full">{renderCalendarDays()}</div>
      {showEventList && selectedDate && (
        <EventListModal
          date={selectedDate}
          events={getEventsForDateRange(events, selectedDate, selectedDate)}
          onClose={handleEventListClose}
          onEventClick={handleEventListEventClick}
          position={modalPosition}
        />
      )}
    </div>
  );
}
