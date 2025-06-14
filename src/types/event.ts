export type EventType = 'event' | 'task';
export type RepeatType = 'none' | 'daily';
export type EventRepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekday';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekday';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval?: number; // 매 N일/주/월/년
  daysOfWeek?: number[]; // 0-6 (일-토)
  dayOfMonth?: number; // 1-31
  month?: number; // 1-12
  weekOfMonth?: number; // 1-5 (첫째 주-다섯째 주)
  endDate?: string; // 반복 종료일
}

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
  recurrence?: RecurrenceRule;
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
