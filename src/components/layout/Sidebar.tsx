'use client';

import { useState } from 'react';

import { Plus, ChevronDown } from 'lucide-react';

import { MiniCalendar } from '../mini-calendar';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <aside
      className={`w-64 border-r border-neutral-gray-200 flex flex-col transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-2">
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:shadow-md border border-neutral-gray-200 transition-shadow">
          <Plus className="w-5 h-5" />
          <span>만들기</span>
        </button>
      </div>

      <div className="px-2 py-4">
        <MiniCalendar selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <li>
            <button className="w-full flex items-center justify-between px-4 py-2 rounded-full hover:bg-neutral-gray-100">
              <span>내 캘린더</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between px-4 py-2 rounded-full hover:bg-neutral-gray-100">
              <span>다른 캘린더</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
