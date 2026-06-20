import { useState } from "react"
import { DAYS, toKey } from "../utils/date"
import { SITE_LIST } from "../data/sites"
import { statusStyle } from "../utils/status"

export default function AdminCalendarView({ reservations, onSelect }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState("")

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  const prevMonth = () =>
    month === 0 ? (setYear((y) => y - 1), setMonth(11)) : setMonth((m) => m - 1)
  const nextMonth = () =>
    month === 11 ? (setYear((y) => y + 1), setMonth(0)) : setMonth((m) => m + 1)

  const getActiveReservations = (dateKey) =>
    reservations.filter(
      (r) => r.status !== "취소" && r.checkIn <= dateKey && r.checkOut > dateKey
    )

  const getSiteMap = (dateKey) => {
    const active = getActiveReservations(dateKey)
    const map = {}
    active.forEach((r) => { map[r.site] = r })
    return map
  }

  const activeDateMap = selectedDate ? getSiteMap(selectedDate) : {}
  const activeCount = selectedDate ? getActiveReservations(selectedDate).length : 0

  return (
    <div>
      {/* 캘린더 */}
      <div className="bg-surface px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {year}년 {month + 1}월
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((d, i) => {
            if (!d) return <div key={`e-${i}`} />
            const dateKey = toKey(year, month, d)
            const active = getActiveReservations(dateKey)
            const isSelected = selectedDate === dateKey
            const hasPending = active.some((r) => r.status === "대기중")
            const count = active.length

            return (
              <button
                key={d}
                onClick={() => setSelectedDate(isSelected ? "" : dateKey)}
                className={`flex flex-col items-center py-1.5 rounded-lg transition-colors ${
                  isSelected ? "bg-primary" : "hover:bg-primary-light"
                }`}
              >
                <span
                  className={`text-xs mb-1 ${isSelected ? "text-white" : "text-gray-600"}`}
                >
                  {d}
                </span>
                {count > 0 ? (
                  <span
                    className={`text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      isSelected
                        ? "bg-surface text-primary"
                        : hasPending
                          ? "bg-primary-light text-primary"
                          : "bg-primary text-white"
                    }`}
                  >
                    {count}
                  </span>
                ) : (
                  <span className="w-5 h-5" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-primary-light" />
            <span className="text-xs text-gray-400">대기중 포함</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <span className="text-xs text-gray-400">전체 확정</span>
          </div>
        </div>
      </div>

      {!selectedDate && (
        <p className="text-center text-xs text-gray-300 py-10">
          날짜를 선택하면 사이트 현황을 표시합니다
        </p>
      )}

      {selectedDate && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">{selectedDate}</p>
            <span className="text-xs text-gray-400">
              {activeCount}건 예약 · {10 - activeCount}건 공실
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {SITE_LIST.map((site) => {
              const r = activeDateMap[site.id]
              const reserved = !!r
              return (
                <button
                  key={site.id}
                  onClick={() => reserved && onSelect(r.id)}
                  disabled={!reserved}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
                    reserved
                      ? "bg-surface border-gray-200 cursor-pointer"
                      : "bg-gray-50 border-gray-100 cursor-default"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                      reserved
                        ? r.status === "확정"
                          ? "bg-primary text-white"
                          : "bg-primary-light text-primary"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {site.id}
                  </div>
                  {reserved ? (
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">
                          {r.name}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${statusStyle(r.status)}`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {r.checkIn} ~ {r.checkOut} · {r.nights}박
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-300">공실</span>
                  )}
                  {reserved && (
                    <span className="text-gray-300 text-sm shrink-0">›</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
