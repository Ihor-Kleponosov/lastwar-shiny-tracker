import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

export function getServerDate(date: Date, timeZone: string): Date {
  return toZonedTime(date, timeZone)
}

export function formatServerDateTime(date: Date, timeZone: string, dateFormat: string): string {
  return formatInTimeZone(date, timeZone, dateFormat)
}
