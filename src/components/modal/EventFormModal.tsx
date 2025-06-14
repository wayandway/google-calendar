'use client';

import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { addEvent } from '@/store/slices/calendarSlice';
import { Event, EventFormData } from '@/types/event';

interface EventFormModalProps {
  selectedDate: Date;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function EventFormModal({ selectedDate, onClose, position }: EventFormModalProps) {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const eventData: EventFormData = {
      title: formData.get('title') as string,
      type: formData.get('type') as 'event' | 'task',
      start: new Date(formData.get('start') as string),
      end: new Date(formData.get('end') as string),
      isAllDay: formData.get('isAllDay') === 'true',
      repeat: formData.get('repeat') as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly',
      author: formData.get('author') as string,
      color: formData.get('color') as string,
    };

    const event: Event = {
      id: Date.now().toString(),
      ...eventData,
      start: eventData.start.toISOString(),
      end: eventData.end.toISOString(),
    };

    dispatch(addEvent(event));
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="fixed bg-white rounded-lg shadow-lg p-4 w-96"
      style={{ top: position.y, left: position.x }}
    >
      <h2 className="text-lg font-semibold mb-4">새 일정</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            name="title"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="일정 제목"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">시작</label>
          <input
            type="datetime-local"
            name="start"
            required
            defaultValue={format(selectedDate, "yyyy-MM-dd'T'HH:mm")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">종료</label>
          <input
            type="datetime-local"
            name="end"
            required
            defaultValue={format(
              new Date(selectedDate.getTime() + 60 * 60 * 1000),
              "yyyy-MM-dd'T'HH:mm",
            )}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">종일</label>
          <input type="checkbox" name="isAllDay" value="true" className="mr-2" />
          <span className="text-sm text-gray-600">종일</span>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">반복</label>
          <select name="repeat" className="w-full px-3 py-2 border rounded-md">
            <option value="none">반복 안함</option>
            <option value="daily">매일</option>
            <option value="weekly">매주</option>
            <option value="monthly">매월</option>
            <option value="yearly">매년</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
          <input
            type="text"
            name="author"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="작성자"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">색상</label>
          <input type="color" name="color" defaultValue="#3b82f6" className="w-full h-10" />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
