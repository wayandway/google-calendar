'use client';

import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import MiniCalendar from '@/components/mini-calendar/MiniCalendar';
import EventFormModal from '@/components/modal/EventFormModal';
import { RootState } from '@/store';
import { toggleSidebar } from '@/store/slices/layoutSlice';

export default function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.layout.isSidebarOpen);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        dispatch(toggleSidebar());
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dispatch]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <MiniCalendar />
      </div>
      {isModalOpen && (
        <EventFormModal
          selectedDate={new Date(selectedDate)}
          onClose={() => setIsModalOpen(false)}
          position={{ x: 300, y: 100 }}
        />
      )}
    </div>
  );
}
