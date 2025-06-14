'use client';

import React, { useCallback, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import MonthView from './MonthView';
import WeekView from './WeekView';

import EventFormModal from '@/components/modal/EventFormModal';
import EventViewModal from '@/components/modal/EventViewModal';
import { RootState } from '@/store';
import { setSelectedDate, moveToPrevMonth, moveToNextMonth } from '@/store/slices/calendarSlice';
import { Event } from '@/types/event';

export default function MainCalendar() {
  const dispatch = useDispatch();
  const { currentDate, view } = useSelector((state: RootState) => state.calendar);
  const events = useSelector((state: RootState) => state.event.events);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(
    null,
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleDateClick = (date: Date, event?: React.MouseEvent) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setModalPosition({ x: rect.left - 320, y: rect.top });
    }
    dispatch(setSelectedDate(date.toISOString()));
    setSelectedDateRange(null);
    setIsFormModalOpen(true);
  };

  const handleEventClick = (event: Event, clickEvent: React.MouseEvent) => {
    clickEvent.stopPropagation();
    const rect = clickEvent.currentTarget.getBoundingClientRect();
    setModalPosition({ x: rect.left - 320, y: rect.top });
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleDateRangeSelect = (start: Date, end: Date) => {
    dispatch(setSelectedDate(start.toISOString()));
    setSelectedDateRange({ start, end });

    // 모달 위치 계산
    const calendarElement = globalThis.document.querySelector('.calendar-container');
    if (calendarElement) {
      // 선택한 날짜/시간 셀의 위치 계산
      const cellElement = globalThis.document.querySelector(
        view === 'month'
          ? `.day-cell[data-date="${start.toISOString().split('T')[0]}"]`
          : `.time-cell[data-time="${start.getHours()}:${start.getMinutes()}"]`,
      );

      if (cellElement) {
        const cellRect = cellElement.getBoundingClientRect();
        setModalPosition({
          x: cellRect.left - 320, // 모달 너비(320px)만큼 왼쪽으로
          y: cellRect.top,
        });
      } else {
        // 셀 요소를 찾지 못한 경우 기본 위치 계산
        const rect = calendarElement.getBoundingClientRect();
        const dayWidth = rect.width / 7;
        const dayIndex = start.getDay();
        const x = rect.left + dayWidth * dayIndex - 320;
        const y =
          view === 'week'
            ? rect.top + ((start.getHours() * 60 + start.getMinutes()) * 60) / 60
            : rect.top;
        setModalPosition({ x, y });
      }
    }

    setIsFormModalOpen(true);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setSelectedDateRange(null);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedEvent(null);
  };

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (view === 'month') {
        if (e.deltaY < 0) {
          dispatch(moveToPrevMonth());
        } else {
          dispatch(moveToNextMonth());
        }
      }
    },
    [dispatch, view],
  );

  return (
    <div className="flex flex-col h-full calendar-container">
      <div className="flex-1 overflow-auto rounded-lg bg-white" onWheel={handleWheel}>
        {view === 'month' ? (
          <MonthView
            currentDate={new Date(currentDate)}
            events={events}
            onEventClick={(event, e) => handleEventClick(event, e)}
            onDateClick={handleDateClick}
            onDateRangeSelect={handleDateRangeSelect}
            selectedRange={selectedDateRange}
          />
        ) : (
          <WeekView
            currentDate={new Date(currentDate)}
            events={events}
            onEventClick={(event, e) => handleEventClick(event, e)}
            onDateClick={handleDateClick}
            onDateRangeSelect={handleDateRangeSelect}
            selectedRange={selectedDateRange}
          />
        )}
      </div>

      {isFormModalOpen && (
        <EventFormModal
          selectedDate={new Date(currentDate)}
          onClose={handleFormModalClose}
          position={modalPosition}
          dateRange={selectedDateRange || undefined}
        />
      )}

      {isViewModalOpen && selectedEvent && (
        <EventViewModal
          event={selectedEvent}
          onClose={handleViewModalClose}
          position={modalPosition}
        />
      )}
    </div>
  );
}
