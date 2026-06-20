export const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

export function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function toDateInputStr(date) {
  return date.toISOString().split("T")[0]
}
