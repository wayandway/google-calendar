'use client';

import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import MiniCalendar from '@/components/mini-calendar/MiniCalendar';

export default function Sidebar() {
  const { isSidebarOpen } = useSelector((state: RootState) => state.layout);

  return (
    <>
      {isSidebarOpen ? (
        <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r overflow-y-auto">
          <div className="p-4">
            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              만들기
            </button>
          </div>
          <div className="p-4">
            <MiniCalendar />
          </div>
        </div>
      ) : (
        <div className="fixed top-16 left-0 p-4">
          <button className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
