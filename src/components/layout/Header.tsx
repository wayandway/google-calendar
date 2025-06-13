'use client';

import React from 'react';

import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import {
  setView,
  moveToPrevMonth,
  moveToNextMonth,
  moveToToday,
} from '@/store/features/calendarSlice';

export default function Header() {
  const dispatch = useDispatch();
  const { currentDate, view } = useSelector((state: RootState) => state.calendar);
  const date = new Date(currentDate);
  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

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
            onClick={() => dispatch(moveToToday())}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 ml-4"
          >
            오늘
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch(moveToPrevMonth())}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => dispatch(moveToNextMonth())}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold">
            {date.getFullYear()}년 {monthNames[date.getMonth()]}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setView('month'))}
            className={`px-3 py-1 text-sm rounded ${view === 'month' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            월
          </button>
          <button
            onClick={() => dispatch(setView('week'))}
            className={`px-3 py-1 text-sm rounded ${view === 'week' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            주
          </button>
        </div>
      </div>
    </header>
  );
}
