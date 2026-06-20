export const STATUS_FILTERS = ["대기중", "확정", "취소"]

export function statusStyle(status) {
  if (status === "대기중") return "bg-primary-light text-primary"
  if (status === "확정") return "bg-primary text-white"
  return "bg-gray-100 text-gray-400"
}
