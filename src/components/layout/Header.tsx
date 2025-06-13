'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React from 'react';

import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import { setSelectedDate, setCurrentDate, setView } from '@/store/features/calendarSlice';

export default function Header() {
  const dispatch = useDispatch();
  const { currentDate, view } = useSelector((state: RootState) => state.calendar);
  const date = new Date(currentDate);

  const handleTodayClick = () => {
    const today = new Date();
    dispatch(setSelectedDate(today.toISOString()));
    dispatch(setCurrentDate(today.toISOString()));
  };

  const handlePrevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    dispatch(setCurrentDate(newDate.toISOString()));
  };

  const handleNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    dispatch(setCurrentDate(newDate.toISOString()));
  };

  const handleViewChange = (newView: 'month' | 'week') => {
    dispatch(setView(newView));
  };

  return (
    <header className="h-16 border-b bg-white">
      <div className="flex items-center h-full px-4 justify-between">
        <div className="flex items-center space-x-4">
          <button type="button" className="p-2 hover:bg-gray-100 rounded-full" aria-label="메뉴">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="text-xl font-semibold text-gray-800 hover:text-gray-600">
            Google Calendar
          </Link>
          <button
            onClick={handleTodayClick}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            오늘
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold">{format(date, 'yyyy년 MMMM', { locale: ko })}</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewChange('month')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              view === 'month'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            월
          </button>
          <button
            onClick={() => handleViewChange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              view === 'week'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            주
          </button>
        </div>
      </div>
    </header>
  );
}
