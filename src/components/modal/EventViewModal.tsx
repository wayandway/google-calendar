'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';

import { deleteEvent } from '@/store/slices/eventSlice';
import { Event } from '@/types/event';

interface EventViewModalProps {
  event: Event;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function EventViewModal({ event, onClose, position }: EventViewModalProps) {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleDelete = () => {
    dispatch(deleteEvent(event.id));
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {event.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700">설명</label>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">시작</label>
            <p className="mt-1 text-sm text-gray-600">
              {format(
                new Date(event.start),
                event.allDay ? 'yyyy년 MM월 dd일' : 'yyyy년 MM월 dd일 HH:mm',
                {
                  locale: ko,
                },
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">종료</label>
            <p className="mt-1 text-sm text-gray-600">
              {format(
                new Date(event.end),
                event.allDay ? 'yyyy년 MM월 dd일' : 'yyyy년 MM월 dd일 HH:mm',
                {
                  locale: ko,
                },
              )}
            </p>
          </div>

          {event.allDay && (
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                종일
              </span>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
