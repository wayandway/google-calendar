import { Event } from '@/types/event';

const STORAGE_KEY = 'calendar_events';

const getLocalStorage = (key: string): string | null => {
  if (typeof globalThis === 'undefined') return null;
  return globalThis.localStorage.getItem(key);
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof globalThis === 'undefined') return;
  globalThis.localStorage.setItem(key, value);
};

const logError = (message: string, error: unknown): void => {
  if (typeof globalThis === 'undefined') return;
  globalThis.console.error(message, error);
};

export const saveEventsToStorage = (events: Event[]) => {
  try {
    setLocalStorage(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    logError('이벤트 저장 중 오류 발생:', error);
  }
};

export const loadEventsFromStorage = (): Event[] => {
  try {
    const events = getLocalStorage(STORAGE_KEY);
    return events ? JSON.parse(events) : [];
  } catch (error) {
    logError('이벤트 로드 중 오류 발생:', error);
    return [];
  }
};
