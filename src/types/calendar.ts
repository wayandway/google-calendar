import { Event } from './event';

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
  isRecurring?: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
}

export interface DragState {
  isDragging: boolean;
  startDate: Date | null;
  endDate: Date | null;
  startTime?: number | null;
  endTime?: number | null;
}

export interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date | null;
}

export interface BaseCalendarProps {
  events?: Event[];
  onEventClick?: (event: Event, clickEvent: React.MouseEvent) => void;
  onDateClick?: (date: Date, event?: React.MouseEvent) => void;
  onDateRangeSelect?: (start: Date, end: Date) => void;
  selectedRange?: { start: Date; end: Date } | null;
}

export interface MainCalendarProps extends BaseCalendarProps {
  onEventCreate?: (start: Date, end: Date) => void;
  defaultView?: CalendarView;
}

export interface MonthViewProps extends BaseCalendarProps {
  currentDate: Date;
}

export interface WeekViewProps extends BaseCalendarProps {
  currentDate: Date;
}
