'use client';

import { format } from 'date-fns';
import React, { useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';

import { addEvent } from '@/store/slices/eventSlice';
import { Event } from '@/types/event';

interface EventFormModalProps {
  selectedDate: Date;
  onClose: () => void;
  position: { x: number; y: number };
  dateRange?: { start: Date; end: Date };
}

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
      repeat: 'none',
      author: 'user',
      zIndex: 0,
    };
    dispatch(addEvent(newEvent));
    onClose();
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
