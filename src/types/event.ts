export type EventType = 'event' | 'task';
export type RepeatType = 'none' | 'daily';
export type EventRepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO string
  end: string; // ISO string
  allDay?: boolean;
  color?: string;
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

export interface Event extends Omit<EventFormData, 'start' | 'end'> {
  id: string;
  zIndex: number;
  start: string;
  end: string;
}
