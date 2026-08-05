import { getServerDate } from '@/utils/serverTime'

export function getCurrentMonthValue(timeZone: string, now = new Date()) {
  const serverDate = getServerDate(now, timeZone)

  return `${serverDate.getFullYear()}-${String(serverDate.getMonth() + 1).padStart(2, '0')}`
}

export function getDateFromMonthValue(monthValue: string) {
  const [year, month] = monthValue.split('-').map(Number)

  return new Date(year, month - 1)
}
