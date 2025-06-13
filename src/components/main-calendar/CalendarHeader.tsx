import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CalendarView } from '@/types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
}

export default function CalendarHeader({
  currentDate,
  view,
  onPrevMonth,
  onNextMonth,
  onToday,
  onViewChange,
}: CalendarHeaderProps): React.ReactElement {
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
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <button onClick={onToday} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">
          오늘
        </button>
        <div className="flex items-center space-x-2">
          <button onClick={onPrevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={onNextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-xl font-semibold">
          {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
        </h2>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onViewChange('month')}
          className={`px-3 py-1 text-sm rounded ${
            view === 'month' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
          }`}
        >
          월
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={`px-3 py-1 text-sm rounded ${
            view === 'week' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
          }`}
        >
          주
        </button>
      </div>
    </div>
  );
}
