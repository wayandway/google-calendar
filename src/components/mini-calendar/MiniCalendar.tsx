'use client';

import { getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, setDate } from 'date-fns';
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import CalendarCaption from './CalendarCaption';

import { RootState } from '@/store';
import { setSelectedDate, moveToPrevMonth, moveToNextMonth } from '@/store/features/calendarSlice';

export default function MiniCalendar() {
  const dispatch = useDispatch();
  const { currentDate, selectedDate } = useSelector((state: RootState) => state.calendar);

  const date = new Date(currentDate);
  const selected = new Date(selectedDate);
  const daysInMonth = getDaysInMonth(date);
  const firstDayOfMonth = getDay(startOfMonth(date));
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 이전 달의 날짜들
  const prevMonth = subMonths(date, 1);
  const prevMonthDays = getDaysInMonth(prevMonth);
  const prevMonthDates = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: prevMonthDays - firstDayOfMonth + i + 1,
    isCurrentMonth: false,
    isPrevMonth: true,
  }));

  // 현재 달의 날짜들
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
    isPrevMonth: false,
  }));

  // 다음 달의 날짜들
  const nextMonth = addMonths(date, 1);
  const remainingDays = 42 - (firstDayOfMonth + daysInMonth); // 6주 * 7일 = 42
  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: false,
    isPrevMonth: false,
  }));

  const allDays = [...prevMonthDates, ...currentMonthDays, ...nextMonthDays];

  const handleDateClick = (day: number, isCurrentMonth: boolean, isPrevMonth: boolean) => {
    let targetDate: Date;
    if (isCurrentMonth) {
      targetDate = setDate(date, day);
    } else if (isPrevMonth) {
      targetDate = setDate(prevMonth, day);
      dispatch(moveToPrevMonth());
    } else {
      targetDate = setDate(nextMonth, day);
      dispatch(moveToNextMonth());
    }
    dispatch(setSelectedDate(targetDate.toISOString()));
  };

  const isToday = (day: number, isCurrentMonth: boolean, isPrevMonth: boolean) => {
    const today = new Date();
    let targetDate: Date;
    if (isCurrentMonth) {
      targetDate = new Date(date.getFullYear(), date.getMonth(), day);
    } else if (isPrevMonth) {
      targetDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
    } else {
      targetDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
    }
    return (
      day === today.getDate() &&
      targetDate.getMonth() === today.getMonth() &&
      targetDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number, isCurrentMonth: boolean, isPrevMonth: boolean) => {
    let targetDate: Date;
    if (isCurrentMonth) {
      targetDate = new Date(date.getFullYear(), date.getMonth(), day);
    } else if (isPrevMonth) {
      targetDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
    } else {
      targetDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
    }
    return (
      day === selected.getDate() &&
      targetDate.getMonth() === selected.getMonth() &&
      targetDate.getFullYear() === selected.getFullYear()
    );
  };

  return (
    <div className="w-full">
      <CalendarCaption
        currentDate={date}
        onPrevMonth={() => dispatch(moveToPrevMonth())}
        onNextMonth={() => dispatch(moveToNextMonth())}
      />
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {weekdays.map((day) => (
          <div
            key={day}
            className={`py-1 ${
              day === '일' ? 'text-red-500' : day === '토' ? 'text-blue-500' : ''
            }`}
          >
            {day}
          </div>
        ))}
        {allDays.map(({ day, isCurrentMonth, isPrevMonth }) => (
          <button
            key={`${isPrevMonth ? 'prev' : isCurrentMonth ? 'current' : 'next'}-${day}`}
            type="button"
            onClick={() => handleDateClick(day, isCurrentMonth, isPrevMonth)}
            className={`py-1 rounded-full hover:bg-gray-100 ${
              isToday(day, isCurrentMonth, isPrevMonth)
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : isSelected(day, isCurrentMonth, isPrevMonth)
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : !isCurrentMonth
                    ? 'text-gray-400'
                    : ''
            } ${
              day === 1 && firstDayOfMonth === 0 && isCurrentMonth
                ? 'text-red-500'
                : day === 1 && firstDayOfMonth === 6 && isCurrentMonth
                  ? 'text-blue-500'
                  : ''
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
