'use client';

import { format, addDays, startOfWeek, isSameDay, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useState } from 'react';

import { WeekViewProps } from '@/types/calendar';
import { getEventsForDateRange } from '@/utils/recurrence';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 4 }, (_, i) => i * 15); // 15분 단위로 4개 (0, 15, 30, 45)

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events = [],
  onEventClick,
  onDateRangeSelect,
}: WeekViewProps) => {
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startDate = startOfWeek(currentDate, { locale: ko });
  const endDate = addDays(startDate, 6);
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handleDateClick = (date: Date, hour: number, minute: number, event?: React.MouseEvent) => {
    // 이전 선택 상태 초기화
    setSelectedDate(null);
    setDragStart(null);
    setDragEnd(null);

    // 클릭한 시간부터 1시간 동안의 일정 생성
    const startDate = new Date(date);
    startDate.setHours(hour, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(hour + 1, 0, 0, 0);

    onDateRangeSelect?.(startDate, endDate);
  };

  const handleMouseDown = (date: Date, hour: number, minute: number, event: React.MouseEvent) => {
    // 이전 선택 상태 초기화
    setSelectedDate(null);
    setDragStart(null);
    setDragEnd(null);

    const newDate = new Date(date);
    // 15분 단위로 반올림
    const roundedMinute = Math.round(minute / 15) * 15;
    newDate.setHours(hour, roundedMinute, 0, 0);
    setDragStart(newDate);
    setDragEnd(newDate);
    event.currentTarget.classList.add('bg-blue-200');
  };

  const handleMouseMove = (date: Date, hour: number, minute: number) => {
    if (dragStart) {
      // 같은 날짜 내에서만 드래그 가능하도록 제한
      if (isSameDay(date, dragStart)) {
        const newDate = new Date(date);
        // 15분 단위로 반올림
        const roundedMinute = Math.round(minute / 15) * 15;
        // 현재 셀의 시작 시간
        const cellStartMinute = Math.floor(minute / 15) * 15;

        // 현재 셀을 완전히 드래그한 경우 (셀의 75% 이상 드래그)
        if (minute - cellStartMinute >= 11) {
          // 15분의 75% = 11.25분
          newDate.setHours(hour, roundedMinute + 15, 0, 0);
        } else {
          newDate.setHours(hour, roundedMinute, 0, 0);
        }
        setDragEnd(newDate);
      }
    }
  };

  const handleMouseUp = () => {
    if (dragStart && dragEnd) {
      // 같은 날짜 내에서만 드래그 가능하도록 제한
      if (isSameDay(dragStart, dragEnd)) {
        let start = dragStart < dragEnd ? dragStart : dragEnd;
        let end = dragStart < dragEnd ? dragEnd : dragStart;

        // 종료 시간이 45분인 경우 다음 시간의 0분으로 설정
        if (end.getMinutes() === 45) {
          end = new Date(end);
          end.setHours(end.getHours() + 1, 0, 0, 0);
        }

        onDateRangeSelect?.(start, end);
      }
    }
    // 드래그 상태 초기화
    setDragStart(null);
    setDragEnd(null);
  };

  const isTimeSelected = (date: Date, hour: number, minute: number) => {
    const currentTime = new Date(date);
    currentTime.setHours(hour, minute, 0, 0);

    // 드래그 중일 때
    if (dragStart && dragEnd) {
      const start = dragStart < dragEnd ? dragStart : dragEnd;
      const end = dragStart < dragEnd ? dragEnd : dragStart;

      // 현재 셀의 시작 시간
      const cellStartMinute = Math.floor(minute / 15) * 15;

      // 현재 셀을 완전히 드래그한 경우 (셀의 75% 이상 드래그)
      if (minute - cellStartMinute >= 11) {
        // 15분의 75% = 11.25분
        const extendedEnd = new Date(end);
        extendedEnd.setMinutes(end.getMinutes() + 15);
        return isWithinInterval(currentTime, { start, end: extendedEnd });
      }

      return isWithinInterval(currentTime, { start, end });
    }

    return false;
  };

  const renderTimeGrid = () => {
    // 주간의 모든 이벤트를 가져옴
    const weekEvents = getEventsForDateRange(events, startDate, endDate);

    return (
      <div className="grid grid-cols-[4rem_1fr] h-full cursor-default">
        {/* 시간 열 */}
        <div className="border-r border-[#dee2e8]">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-[#dee2e8] text-[.6rem] text-gray-500 p-1 flex items-start justify-center"
            >
              {hour !== 0 && format(new Date().setHours(hour, 0), 'a h시', { locale: ko })}
            </div>
          ))}
        </div>

        {/* 날짜별 시간 그리드 */}
        <div className="grid grid-cols-7">
          {days.map((date) => (
            <div key={date.toISOString()} className="border-r border-[#dee2e8]">
              {HOURS.map((hour) => (
                <div key={hour} className="h-16 border-b border-[#dee2e8] relative">
                  {MINUTES.map((minute) => (
                    <div
                      key={minute}
                      className={`absolute w-full h-4 transition-colors ${
                        isTimeSelected(date, hour, minute) ? 'bg-blue-200' : ''
                      }`}
                      style={{ top: `${(minute / 60) * 100}%` }}
                      data-time={`${hour}:${minute}`}
                      onClick={() => handleDateClick(date, hour, minute)}
                      onMouseDown={(e) => handleMouseDown(date, hour, minute, e)}
                      onMouseEnter={() => handleMouseMove(date, hour, minute)}
                    />
                  ))}

                  {/* 해당 시간의 이벤트 표시 (반복 일정 포함) */}
                  {weekEvents
                    .filter((event) => {
                      const eventStart = new Date(event.start);
                      const currentTime = new Date(date);
                      currentTime.setHours(hour, 0, 0, 0);

                      return (
                        !event.isAllDay &&
                        isSameDay(eventStart, date) &&
                        eventStart.getHours() === hour
                      );
                    })
                    .map((event) => {
                      const eventStart = new Date(event.start);
                      const eventEnd = new Date(event.end);
                      const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
                      const height = (duration / 60) * 100;

                      return (
                        <div
                          key={event.id}
                          className="absolute left-0 right-0 mx-1 p-1 text-xs bg-blue-100 rounded cursor-pointer truncate hover:z-10 hover:shadow-md transition-all"
                          style={{
                            top: `${(eventStart.getMinutes() / 60) * 100}%`,
                            height: `${height}%`,
                            backgroundColor: event.color ? `${event.color}40` : '#3b82f640',
                            borderLeft: `4px solid ${event.color || '#3b82f6'}`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(event, e);
                          }}
                        >
                          {event.title}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-full cursor-default"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 요일 헤더 */}
      <div className="grid grid-cols-[4rem_1fr] bg-white rounded-t-2xl">
        <div className="p-2 text-center font-semibold"></div>
        <div className="grid grid-cols-7">
          {days.map((date) => (
            <div key={date.toISOString()} className="p-2 text-center">
              <div className="text-[11px]">{format(date, 'E', { locale: ko })}</div>
              <div
                className={`text-[26px] font-normal ${isSameDay(date, new Date()) ? 'text-white' : 'text-black'}`}
              >
                <span
                  className={`inline-flex items-center justify-center rounded-full p-2 ${
                    isSameDay(date, new Date()) ? 'bg-[#0953c3] w-12 h-12' : 'w-10 h-10'
                  }`}
                >
                  {format(date, 'd')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 종일 이벤트 영역 */}
      <div className="border-b border-[#dee2e8]">
        <div className="grid grid-cols-[4rem_1fr]">
          <div className="border-r border-[#dee2e8] p-2 text-center text-[.6rem]">GMT+09</div>
          <div className="relative">
            <div className="grid grid-cols-7 h-full">
              {days.map((date) => (
                <div key={date.toISOString()} className="border-r border-[#dee2e8]">
                  {getEventsForDateRange(events, startDate, endDate)
                    .filter((event) => event.isAllDay)
                    .map((event) => {
                      const eventStart = new Date(event.start);
                      const eventEnd = new Date(event.end);
                      const startDayIndex = days.findIndex((day) => isSameDay(day, eventStart));
                      const endDayIndex = days.findIndex((day) => isSameDay(day, eventEnd));

                      // 현재 주에 포함되지 않는 이벤트는 표시하지 않음
                      if (startDayIndex === -1 && endDayIndex === -1) return null;

                      // 이벤트가 주의 시작일보다 이전에 시작하는 경우
                      const adjustedStartIndex = startDayIndex === -1 ? 0 : startDayIndex;
                      // 이벤트가 주의 마지막 날보다 이후에 끝나는 경우
                      const adjustedEndIndex = endDayIndex === -1 ? 6 : endDayIndex;

                      const daySpan = adjustedEndIndex - adjustedStartIndex + 1;
                      const startPosition = (adjustedStartIndex / 7) * 100;

                      return (
                        <div
                          key={event.id}
                          className="absolute p-1 text-xs bg-blue-100 rounded cursor-pointer truncate"
                          style={{
                            left: `${startPosition}%`,
                            width: `${(daySpan / 7) * 100}%`,
                            backgroundColor: event.color ? `${event.color}40` : '#3b82f640',
                            borderLeft: `4px solid ${event.color || '#3b82f6'}`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(event, e);
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
        </div>
      </div>

      {/* 시간별 이벤트 영역 */}
      <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {renderTimeGrid()}
      </div>
    </div>
  );
};

export default WeekView;
