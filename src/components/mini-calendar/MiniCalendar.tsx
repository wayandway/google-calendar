'use client';

import {
  getDaysInMonth,
  startOfMonth,
  getDay,
  addMonths,
  subMonths,
  setDate,
  format,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import CalendarCaption from './CalendarCaption';

import { RootState } from '@/store';
import {
  setSelectedDate,
  moveToPrevMonth,
  moveToNextMonth,
  moveToToday,
  setView,
} from '@/store/features/calendarSlice';

export default function MiniCalendar() {
  const dispatch = useDispatch();
  const { currentDate, selectedDate } = useSelector((state: RootState) => state.calendar);
  const date = new Date(currentDate);
  const selected = new Date(selectedDate);
  const today = new Date();

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
      targetDate = setDate(new Date(date.getFullYear(), date.getMonth() - 1), day);
      dispatch(moveToPrevMonth());
    } else {
      targetDate = setDate(new Date(date.getFullYear(), date.getMonth() + 1), day);
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

  const renderCalendarDays = () => {
    const days = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    const nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // 이전 달의 날짜들
    for (let i = firstDay.getDay(); i > 0; i--) {
      const day = prevMonthLastDay.getDate() - i + 1;
      const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, day);
      const isToday = isSameDay(prevMonthDate, today);
      days.push(
        <button
          key={`prev-${day}`}
          onClick={() => handleDateClick(day, false, true)}
          className="text-gray-400 hover:bg-gray-100 rounded"
        >
          <div
            className={`flex items-center justify-center w-6 h-6 mx-auto rounded-full ${
              isToday ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {day}
          </div>
        </button>,
      );
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
      const isSelected = isSameDay(currentDate, selected);
      const isToday = isSameDay(currentDate, today);
      days.push(
        <button
          key={i}
          onClick={() => handleDateClick(i, true, false)}
          className={`hover:bg-gray-100 rounded ${isSelected ? 'bg-sky-100' : ''}`}
        >
          <div
            className={`flex items-center justify-center w-6 h-6 mx-auto rounded-full ${
              isToday ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {i}
          </div>
        </button>,
      );
    }

    // 다음 달의 날짜들
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
      const isToday = isSameDay(nextMonthDate, today);
      days.push(
        <button
          key={`next-${i}`}
          onClick={() => handleDateClick(i, false, false)}
          className="text-gray-400 hover:bg-gray-100 rounded"
        >
          <div
            className={`flex items-center justify-center w-6 h-6 mx-auto rounded-full ${
              isToday ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {i}
          </div>
        </button>,
      );
    }

    return days;
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
        {renderCalendarDays()}
      </div>
    </div>
  );
}
