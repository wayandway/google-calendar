export type EventType = 'event' | 'task';
export type RepeatType = 'none' | 'daily';
export type EventRepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  start: string; // ISO string
  end: string; // ISO string
  isAllDay: boolean;
  repeat: EventRepeatType;
  author: string;
  color: string;
  zIndex: number;
}

export interface EventFormData {
  title: string;
  type: EventType;
  start: Date;
  end: Date;
  isAllDay: boolean;
  repeat: EventRepeatType;
  author: string;
  color: string;
}
