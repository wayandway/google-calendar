'use client';

import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { deleteEvent } from '@/store/slices/calendarSlice';
import { Event } from '@/types/event';

interface EventViewModalProps {
  event: Event;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function EventViewModal({ event, onClose, position }: EventViewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleDelete = () => {
    dispatch(deleteEvent(event.id));
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="fixed bg-white rounded-lg shadow-lg p-4 w-96"
      style={{ top: position.y, left: position.x }}
    >
      <div className="mb-4">
        <div
          className="w-2 h-2 rounded-full mb-2"
          style={{ backgroundColor: event.color || '#3b82f6' }}
        />
        <h2 className="text-lg font-semibold">{event.title}</h2>
        <div className="text-sm text-gray-500">
          {format(new Date(event.start), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })} -{' '}
          {format(new Date(event.end), 'HH:mm', { locale: ko })}
        </div>
      </div>
      {event.description && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">설명</h3>
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
        >
          삭제
        </button>
        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
          닫기
        </button>
      </div>
    </div>
  );
}
