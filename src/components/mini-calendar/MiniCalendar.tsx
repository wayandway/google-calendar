import { ko } from 'date-fns/locale';
import React from 'react';

import { DayPicker } from 'react-day-picker';

import 'react-day-picker/dist/style.css';
import CalendarCaption from './CalendarCaption';

interface MiniCalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
}

export default function MiniCalendar({ selected, onSelect }: MiniCalendarProps) {
  const [month, setMonth] = React.useState<Date>(selected);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onSelect(date);
      setMonth(date);
    }
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setMonth(newMonth);
  };

  return (
    <div className="w-full px-1 scale-90 origin-top">
      <DayPicker
        mode="single"
        selected={selected}
        month={month}
        onMonthChange={setMonth}
        onSelect={handleSelect}
        showOutsideDays
        fixedWeeks
        locale={ko}
        className="text-sm [&_.rdp-cell]:p-0 [&_.rdp-day]:h-5 [&_.rdp-day]:w-5 [&_.rdp-day]:text-xs [&_.rdp-nav]:hidden [&_.rdp-caption]:mb-0.5 [&_.rdp-head_cell]:text-xs [&_.rdp-head_cell]:text-neutral-gray-500 [&_.rdp-head_cell]:font-normal [&_.rdp-table]:w-full [&_.rdp-month]:w-full [&_.rdp-months]:w-full [&_.rdp-months]:flex [&_.rdp-months]:justify-center [&_.rdp-month]:w-[calc(100%-0.5rem)] [&_.rdp-caption]:px-0 [&_.rdp-caption]:w-[calc(100%-0.5rem)] [&_.rdp-day]:cursor-pointer [&_.rdp-day]:hover:bg-neutral-gray-200/80 [&_.rdp-day]:transition-colors"
        components={{
          Caption: ({ displayMonth }: { displayMonth: Date }) => (
            <CalendarCaption
              displayMonth={displayMonth}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
            />
          ),
        }}
        modifiers={{
          today: new Date(),
        }}
        modifiersClassNames={{
          selected: 'bg-brand-primary text-white rounded-full hover:bg-brand-primary/90',
          today: 'bg-brand-primary text-white rounded-full hover:bg-brand-primary/90',
          outside: 'text-neutral-gray-400',
          day: 'rounded-full text-neutral-gray-800 flex items-center justify-center',
        }}
        modifiersStyles={{
          selected: {
            background: '#4285f4',
            color: '#fff',
          },
          today: {
            background: '#4285f4',
            color: '#fff',
          },
          outside: {
            color: '#adb5bd',
          },
        }}
        formatters={{
          formatWeekdayName: (day) => ['일', '월', '화', '수', '목', '금', '토'][day.getDay()],
          formatCaption: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
        }}
      />
    </div>
  );
}
