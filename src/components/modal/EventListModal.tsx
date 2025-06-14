'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useEffect, useRef } from 'react';

import { Event } from '@/types/event';

interface EventListModalProps {
  date: Date;
  events: Event[];
  onClose: () => void;
  onEventClick: (
    event: Event,
    clickEvent: React.MouseEvent,
    position?: { x: number; y: number },
  ) => void;
  position: { x: number; y: number };
}

export const EventListModal: React.FC<EventListModalProps> = ({
  date,
  events,
  onClose,
  onEventClick,
  position,
}) => {
  const modalRef = useRef<globalThis.HTMLDivElement>(null);
  const modalWidth = 320; // 모달의 예상 너비

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

  const handleEventClick = (event: Event, clickEvent: React.MouseEvent) => {
    const target = clickEvent.currentTarget as globalThis.HTMLElement;
    const rect = target.getBoundingClientRect();
    const windowWidth = globalThis.window.innerWidth;
    const eventModalWidth = 320; // 이벤트 모달의 예상 너비

    // 맨 왼쪽 열인지 확인 (x 좌표가 100px 이하인 경우)
    const isLeftmostColumn = position.x <= 100;

    // 이벤트 모달 위치 계산
    const eventModalPosition = {
      x: isLeftmostColumn
        ? rect.right
        : windowWidth - rect.right >= eventModalWidth
          ? rect.right
          : rect.left - eventModalWidth,
      y: rect.top,
    };

    onEventClick(event, clickEvent, eventModalPosition);
  };

  // 모달 위치 계산
  const windowWidth = globalThis.window.innerWidth;
  const rightSpace = windowWidth - position.x;
  const showOnRight = rightSpace >= modalWidth;

  // 맨 왼쪽 열인지 확인 (x 좌표가 100px 이하인 경우)
  const isLeftmostColumn = position.x <= 100;

  // 모달 외부 클릭 처리
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        pointerEvents: 'auto',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl w-80 max-h-[80vh] overflow-hidden"
        style={{
          left: position.x,
          top: position.y,
          transform: isLeftmostColumn ? 'none' : showOnRight ? 'none' : 'translateX(-100%)',
        }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 이벤트 전파 방지
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {format(date, 'yyyy년 MM월 dd일', { locale: ko })}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
          {events.length === 0 ? (
            <div className="text-center text-gray-500 py-4">등록된 일정이 없습니다.</div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                const isAllDay = event.isAllDay;

                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 클릭 시에도 이벤트 전파 방지
                      handleEventClick(event, e);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ backgroundColor: event.color || '#3b82f6' }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {isAllDay
                            ? '종일'
                            : `${format(eventStart, 'HH:mm')} - ${format(eventEnd, 'HH:mm')}`}
                        </p>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
