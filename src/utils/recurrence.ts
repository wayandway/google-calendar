import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

import { Event, RecurrenceRule } from '@/types/event';

export function generateRecurringEvents(event: Event, startDate: Date, endDate: Date): Event[] {
  if (!event.recurrence || event.recurrence.type === 'none') {
    return [event];
  }

  const events: Event[] = [];
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const duration = eventEnd.getTime() - eventStart.getTime();

  let currentDate = new Date(eventStart);

  // 반복 유형에 따라 시작일 조정
  switch (event.recurrence.type) {
    case 'weekday':
      // 주중 매일: 선택한 날짜가 포함된 주의 시작일로 설정
      currentDate = startOfWeek(eventStart);
      break;
    case 'weekly':
    case 'monthly':
    case 'yearly':
      // 선택한 날짜 그대로 사용
      break;
    default:
      break;
  }

  while (currentDate <= endDate) {
    if (currentDate >= startDate) {
      const newEvent: Event = {
        ...event,
        id: `${event.id}_${currentDate.getTime()}`,
        start: currentDate.toISOString(),
        end: new Date(currentDate.getTime() + duration).toISOString(),
      };
      events.push(newEvent);
    }

    currentDate = getNextOccurrence(currentDate, event.recurrence);
  }

  return events;
}

function getNextOccurrence(date: Date, rule: RecurrenceRule): Date {
  const interval = rule.interval || 1;

  switch (rule.type) {
    case 'daily':
      return addDays(date, interval);

    case 'weekly':
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        let nextDate = addDays(date, 1);
        while (!rule.daysOfWeek.includes(nextDate.getDay())) {
          nextDate = addDays(nextDate, 1);
        }
        return nextDate;
      }
      return addWeeks(date, interval);

    case 'monthly':
      if (rule.weekOfMonth && rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        // 다음 달의 특정 주차의 특정 요일로 이동
        const nextMonth = addMonths(date, interval);
        const firstDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
        const targetDay = rule.daysOfWeek[0];
        const daysToAdd = (targetDay - firstDayOfMonth.getDay() + 7) % 7;
        const firstOccurrence = addDays(firstDayOfMonth, daysToAdd);
        return addWeeks(firstOccurrence, rule.weekOfMonth - 1);
      }
      return addMonths(date, interval);

    case 'yearly':
      if (rule.month !== undefined && rule.dayOfMonth !== undefined) {
        const nextYear = addYears(date, interval);
        return new Date(nextYear.getFullYear(), rule.month - 1, rule.dayOfMonth);
      }
      return addYears(date, interval);

    case 'weekday': {
      let nextDate = addDays(date, 1);
      while (isWeekend(nextDate)) {
        nextDate = addDays(nextDate, 1);
      }
      return nextDate;
    }

    default:
      return addDays(date, 1);
  }
}

export function isEventInRange(event: Event, startDate: Date, endDate: Date): boolean {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);

  return (
    (eventStart >= startDate && eventStart <= endDate) ||
    (eventEnd >= startDate && eventEnd <= endDate) ||
    (eventStart <= startDate && eventEnd >= endDate)
  );
}

export function getEventsForDateRange(events: Event[], startDate: Date, endDate: Date): Event[] {
  const allEvents: Event[] = [];

  events.forEach((event) => {
    const recurringEvents = generateRecurringEvents(event, startDate, endDate);
    allEvents.push(...recurringEvents);
  });

  return allEvents.filter((event) => isEventInRange(event, startDate, endDate));
}
