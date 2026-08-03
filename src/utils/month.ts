export function getCurrentMonthValue() {
  const now = new Date()

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getDateFromMonthValue(monthValue: string) {
  const [year, month] = monthValue.split('-').map(Number)

  return new Date(year, month - 1)
}
