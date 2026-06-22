export const STATUS_FILTERS = ["대기중", "취소요청", "확정", "취소"]

export function statusStyle(status) {
  if (status === "대기중") return "bg-primary-light text-primary"
  if (status === "확정") return "bg-primary text-white"
  if (status === "취소요청") return "bg-orange-100 text-orange-600"
  return "bg-gray-100 text-gray-400"
}
