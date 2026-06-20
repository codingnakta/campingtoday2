import { SITE_LIST } from "../data/sites"
import { AVAILABILITY } from "../data/availability"

export function getAvailableCount(dateKey) {
  return SITE_LIST.filter((s) => AVAILABILITY[s.id]?.[dateKey]).length
}

export function getAvailableSites(dateKey) {
  return SITE_LIST.filter((s) => AVAILABILITY[s.id]?.[dateKey])
}

export function getSitesAvailableForRange(checkIn, checkOut) {
  const dates = []
  const cur = new Date(checkIn)
  const end = new Date(checkOut)
  while (cur < end) {
    dates.push(cur.toISOString().split("T")[0])
    cur.setDate(cur.getDate() + 1)
  }
  return SITE_LIST.filter((site) =>
    dates.every((date) => AVAILABILITY[site.id]?.[date])
  )
}

export function getSitesAvailableForEdit(checkIn, checkOut, excludeId, reservations) {
  if (!checkIn || !checkOut || checkIn >= checkOut) return []
  const dates = []
  const cur = new Date(checkIn)
  const end = new Date(checkOut)
  while (cur < end) {
    dates.push(cur.toISOString().split("T")[0])
    cur.setDate(cur.getDate() + 1)
  }
  const availInData = SITE_LIST.filter((site) =>
    dates.every((date) => AVAILABILITY[site.id]?.[date])
  )
  const otherActive = reservations.filter(
    (r) => r.id !== excludeId && r.status !== "취소"
  )
  return availInData.filter(
    (site) =>
      !otherActive.some(
        (r) => r.site === site.id && r.checkIn < checkOut && r.checkOut > checkIn
      )
  )
}

export function countBadgeStyle(count) {
  if (count === 0) return "text-gray-200"
  if (count <= 3) return "bg-gray-200 text-gray-500"
  if (count <= 6) return "bg-gray-400 text-white"
  return "bg-gray-700 text-white"
}
