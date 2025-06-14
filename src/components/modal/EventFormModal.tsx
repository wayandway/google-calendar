'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';

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
  }, [dateRange]);

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

    // 기본 반복 설정
    const baseRecurrence = {
      type,
      interval: 1,
    };

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

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
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
        className="absolute bg-white rounded-lg shadow-lg p-4 w-80"
        style={{
          left: position.x,
          top: position.y,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">일정 추가</h2>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">시작</label>
            <input
              type={allDay ? 'date' : 'datetime-local'}
              value={format(start, allDay ? 'yyyy-MM-dd' : "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setStart(new Date(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">종료</label>
            <input
              type={allDay ? 'date' : 'datetime-local'}
              value={format(end, allDay ? 'yyyy-MM-dd' : "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setEnd(new Date(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allDay"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="allDay" className="ml-2 block text-sm text-gray-700">
              종일
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">색상</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">반복</label>
            <select
              value={recurrenceType}
              onChange={(e) => handleRecurrenceTypeChange(e.target.value as RecurrenceType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {getRecurrenceOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {renderRecurrenceOptions()}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
