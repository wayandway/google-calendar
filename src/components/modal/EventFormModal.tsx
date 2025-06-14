'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';

import { addEvent } from '@/store/slices/eventSlice';
import { Event, RecurrenceType } from '@/types/event';

interface EventFormModalProps {
  selectedDate: Date;
  onClose: () => void;
  position: { x: number; y: number };
  dateRange?: { start: Date; end: Date };
}

const DAYS_OF_WEEK = [
  { value: 0, label: '일' },
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
];

const WEEKS_OF_MONTH = [
  { value: 1, label: '첫' },
  { value: 2, label: '두' },
  { value: 3, label: '세' },
  { value: 4, label: '네' },
  { value: 5, label: '마지막' },
];

export default function EventFormModal({
  selectedDate,
  onClose,
  position,
  dateRange,
}: EventFormModalProps) {
  const dispatch = useDispatch();
  const modalRef = useRef<globalThis.HTMLDivElement>(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [start, setStart] = React.useState<Date>(dateRange?.start || selectedDate);
  const [end, setEnd] = React.useState<Date>(dateRange?.end || selectedDate);
  const [allDay, setAllDay] = React.useState(false);
  const [color, setColor] = React.useState('#3b82f6');
  const [recurrenceType, setRecurrenceType] = React.useState<RecurrenceType>('none');
  const [selectedDays, setSelectedDays] = React.useState<number[]>([]);
  const [weekOfMonth, setWeekOfMonth] = React.useState<number>(1);
  const [dayOfMonth, setDayOfMonth] = React.useState<number>(1);
  const [month, setMonth] = React.useState<number>(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = React.useState('');
  const [isTimeEditable, setIsTimeEditable] = React.useState(false);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as globalThis.Node)) {
        onClose();
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    globalThis.document.addEventListener('mousedown', handleClickOutside);
    globalThis.document.addEventListener('keydown', handleEscape);

    return () => {
      globalThis.document.removeEventListener('mousedown', handleClickOutside);
      globalThis.document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (dateRange) {
      setStart(dateRange.start);
      setEnd(dateRange.end);
    }
    setIsTimeEditable(!allDay);
  }, [dateRange, allDay]);

  const getRecurrenceOptions = () => {
    const selectedDayOfWeek = start.getDay();
    const dayLabel = DAYS_OF_WEEK[selectedDayOfWeek].label;
    const selectedMonth = start.getMonth() + 1;
    const selectedDay = start.getDate();
    const weekNumber = Math.ceil(selectedDay / 7);
    const weekLabel = WEEKS_OF_MONTH[weekNumber - 1].label;

    // 매월 반복 선택지 텍스트 생성
    let monthlyLabel = '매월';
    if (weekNumber === 1) {
      monthlyLabel = `매월 첫 번째 ${dayLabel}요일`;
    } else if (weekNumber === 5) {
      monthlyLabel = `매월 마지막 ${dayLabel}요일`;
    } else {
      monthlyLabel = `매월 ${weekLabel}번째 ${dayLabel}요일`;
    }

    return [
      { value: 'none', label: '반복 안함' },
      { value: 'daily', label: '매일' },
      { value: 'weekly', label: `매주 ${dayLabel}요일` },
      { value: 'monthly', label: monthlyLabel },
      { value: 'yearly', label: `매년 ${selectedMonth}월 ${selectedDay}일` },
      { value: 'weekday', label: '주중 매일 (월-금)' },
    ];
  };

  const handleRecurrenceTypeChange = (type: RecurrenceType) => {
    setRecurrenceType(type);

    // 선택한 날짜의 요일 가져오기
    const selectedDayOfWeek = start.getDay();

    switch (type) {
      case 'weekly':
        setSelectedDays([selectedDayOfWeek]); // 선택한 날짜의 요일로 초기화
        break;
      case 'monthly':
        setWeekOfMonth(Math.ceil(start.getDate() / 7)); // 선택한 날짜의 주차
        setSelectedDays([selectedDayOfWeek]); // 선택한 날짜의 요일
        break;
      case 'yearly':
        setMonth(start.getMonth() + 1); // 선택한 날짜의 월
        setDayOfMonth(start.getDate()); // 선택한 날짜의 일
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      description,
      start: start.toISOString(),
      end: end.toISOString(),
      isAllDay: allDay,
      color,
      type: 'event',
      repeat: recurrenceType,
      author: 'user',
      zIndex: 0,
      recurrence:
        recurrenceType !== 'none'
          ? {
              type: recurrenceType,
              daysOfWeek: selectedDays,
              weekOfMonth,
              dayOfMonth,
              month,
              endDate: recurrenceEndDate || undefined,
            }
          : undefined,
    };
    dispatch(addEvent(newEvent));
    onClose();
  };

  const renderRecurrenceOptions = () => {
    if (!recurrenceType) return null;

    switch (recurrenceType) {
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        pointerEvents: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-lg p-4 w-[26rem] h-fit flex flex-col justify-between"
        style={{
          left: position.x,
          top: position.y,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex justify-end items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex-1 flex flex-col gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full text-2xl font-normal text-gray-800 focus:outline-none placeholder-gray-400 border-b border-gray-300 pb-2"
              placeholder="제목 추가"
              required
            />

            <div className="flex space-x-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-blue-100 text-blue-800 text-sm font-medium border border-blue-100"
              >
                이벤트
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md text-gray-600 text-sm font-medium"
              >
                할 일
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md text-gray-600 text-sm font-medium"
              >
                약속 일정
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div className="flex-1 flex flex-col space-y-2">
                <input
                  type="text"
                  value={format(start, 'M월 d일 (eee)', { locale: ko })}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer text-center bg-gray-100"
                />
                {!allDay && (
                  <div className="flex flex-col space-y-2">
                    {isTimeEditable ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="datetime-local"
                          value={format(start, "yyyy-MM-dd'T'HH:mm")}
                          onChange={(e) => setStart(new Date(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer text-center bg-gray-100"
                        />
                        <span className="flex items-center justify-center">-</span>
                        <input
                          type="datetime-local"
                          value={format(end, "yyyy-MM-dd'T'HH:mm")}
                          onChange={(e) => setEnd(new Date(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer text-center bg-gray-100"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          value={format(start, 'a h:mm', { locale: ko })}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer text-center bg-gray-100"
                        />
                        <span className="flex items-center justify-center">-</span>
                        <input
                          type="text"
                          value={format(end, 'a h:mm', { locale: ko })}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer text-center bg-gray-100"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allDay"
                checked={allDay}
                onChange={(e) => {
                  setAllDay(e.target.checked);
                  if (e.target.checked) {
                    setIsTimeEditable(false);
                  }
                }}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label htmlFor="allDay" className="text-sm text-gray-700">
                종일
              </label>
              {!allDay && (
                <button
                  type="button"
                  className="text-sm text-blue-600 font-medium"
                  onClick={() => setIsTimeEditable(true)}
                >
                  시간대
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                ></path>
              </svg>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 p-2"
                rows={3}
                placeholder="설명"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={recurrenceType}
                onChange={(e) => handleRecurrenceTypeChange(e.target.value as RecurrenceType)}
                className="block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {getRecurrenceOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {renderRecurrenceOptions()}
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
