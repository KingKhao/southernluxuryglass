export type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
  hasEvent: boolean;
};

/** Builds a 6-week grid for the month containing `reference`, marking days present in `eventDates`. */
export function buildMonthGrid(reference: Date, eventDates: Date[]): CalendarDay[] {
  const year = reference.getFullYear();
  const month = reference.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startWeekday);

  const eventDayKeys = new Set(
    eventDates.map((d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
  );

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    days.push({
      date,
      inCurrentMonth: date.getMonth() === month,
      hasEvent: eventDayKeys.has(key),
    });
  }
  return days;
}
