'use client';

import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { RootState } from '@/store';
import { Event } from '@/types/event';

interface EventListModalProps {
  selectedDate: Date;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function EventListModal({ selectedDate, onClose, position }: EventListModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { events } = useSelector((state: RootState) => state.calendar);

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

  const dayEvents = events.filter((event: Event) => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div
      ref={modalRef}
      className="fixed bg-white rounded-lg shadow-lg p-4 w-96"
      style={{ top: position.y, left: position.x }}
    >
      <h2 className="text-lg font-semibold mb-4">
        {format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko })} 일정
      </h2>
      {dayEvents.length > 0 ? (
        <div className="space-y-2">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="p-2 rounded cursor-pointer hover:bg-gray-50"
              style={{ borderLeft: `4px solid ${event.color || '#3b82f6'}` }}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-gray-500">
                {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-4">등록된 일정이 없습니다.</div>
      )}
      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
          닫기
        </button>
      </div>
    </div>
  );
}
