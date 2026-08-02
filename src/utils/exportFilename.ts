import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

export function getExportFilename(selectedDate: Date) {
  const month = format(selectedDate, 'LLLL', { locale: enUS }).toLowerCase()

  return `last-war-shiny-tasks-${month}-${selectedDate.getFullYear()}.png`
}
