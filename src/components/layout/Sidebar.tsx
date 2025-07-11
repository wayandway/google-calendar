'use client';

import React, { useState, useRef, useEffect } from 'react';

import { Plus } from 'lucide-react';
import { useSelector } from 'react-redux';

import MiniCalendar from '@/components/mini-calendar/MiniCalendar';
import EventFormModal from '@/components/modal/EventFormModal';
import { RootState } from '@/store';

export default function Sidebar() {
  const { isSidebarOpen } = useSelector((state: RootState) => state.layout);
  const { selectedDate } = useSelector((state: RootState) => state.calendar);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<globalThis.HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as globalThis.Node)) {
        setIsDropdownOpen(false);
      }
    };

    globalThis.document.addEventListener('mousedown', handleClickOutside);
    return () => globalThis.document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEventClick = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      {isSidebarOpen ? (
        <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-[#f8fafd] overflow-y-auto">
          <div className="p-4 relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 px-4 py-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>만들기</span>
              </button>
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={handleEventClick}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  이벤트
                </button>
                <button
                  disabled
                  className="w-full px-4 py-2 text-left text-gray-400 cursor-not-allowed"
                >
                  할일
                </button>
                <button
                  disabled
                  className="w-full px-4 py-2 text-left text-gray-400 cursor-not-allowed"
                >
                  약속일정
                </button>
              </div>
            )}
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

      {isModalOpen && (
        <EventFormModal
          selectedDate={new Date(selectedDate)}
          onClose={() => setIsModalOpen(false)}
          position={{ x: 300, y: 100 }}
        />
      )}
    </>
  );
}
