'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarCaptionProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarCaption({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarCaptionProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm font-medium">{format(currentDate, 'yyyy년 M월', { locale: ko })}</div>
      <div className="flex items-center gap-1">
        <button onClick={onPrevMonth} className="p-1 hover:bg-gray-100 rounded" type="button">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={onNextMonth} className="p-1 hover:bg-gray-100 rounded" type="button">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
