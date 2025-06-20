'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React from 'react';

import { Menu, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import { setSelectedDate, setCurrentDate, setView } from '@/store/slices/calendarSlice';
import { toggleSidebar } from '@/store/slices/layoutSlice';

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
    if (view === 'week') {
      newDate.setDate(date.getDate() - 7);
      dispatch(setSelectedDate(newDate.toISOString()));
    } else {
      newDate.setMonth(date.getMonth() - 1);
    }
    dispatch(setCurrentDate(newDate.toISOString()));
  };

  const handleNextMonth = () => {
    const newDate = new Date(date);
    if (view === 'week') {
      newDate.setDate(date.getDate() + 7);
      dispatch(setSelectedDate(newDate.toISOString()));
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    dispatch(setCurrentDate(newDate.toISOString()));
  };

  const handleViewChange = (newView: 'month' | 'week') => {
    dispatch(setView(newView));
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="flex items-center justify-between p-4 h-16 bg-[#f8fafd]">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSidebarToggle}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full hover:cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="구글 캘린더 로고" width={40} height={40} />
          <span className="text-2xl font-normal text-gray-600 cursor-default">Calendar</span>
        </div>
        <button
          onClick={handleTodayClick}
          className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:cursor-pointer"
        >
          오늘
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full hover:cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full hover:cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <h2 className="text-xl font-semibold">{format(date, 'yyyy년 MMMM', { locale: ko })}</h2>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleViewChange('month')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            view === 'month'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          } hover:cursor-pointer`}
        >
          월
        </button>
        <button
          onClick={() => handleViewChange('week')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            view === 'week'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          } hover:cursor-pointer`}
        >
          주
        </button>
      </div>
    </div>
  );
}
