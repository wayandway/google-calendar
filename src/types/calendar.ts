export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isRecurring?: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
}

export type ViewMode = 'week' | 'month';

export interface CalendarState {
  currentDate: string;
  viewMode: ViewMode;
  selectedDate: string | null;
}
