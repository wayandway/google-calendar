import React from 'react';

interface CalendarCaptionProps {
  displayMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarCaption({
  displayMonth,
  onPreviousMonth,
  onNextMonth,
}: CalendarCaptionProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between px-2 py-1 mb-2">
      <button
        type="button"
        onClick={onPreviousMonth}
        className="relative rounded-full p-1 cursor-pointer hover:bg-neutral-gray-200/80 transition-colors"
        aria-label="이전 달"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          className="text-neutral-gray-600"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <span className="font-semibold text-base">
        {displayMonth.getFullYear()} {displayMonth.getMonth() + 1}월
      </span>
      <button
        type="button"
        onClick={onNextMonth}
        className="relative rounded-full p-1 cursor-pointer hover:bg-neutral-gray-200/80 transition-colors"
        aria-label="다음 달"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          className="text-neutral-gray-600"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
