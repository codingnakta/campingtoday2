import { useState } from "react"
import { DAYS, toKey } from "../utils/date"
import { AVAILABILITY } from "../data/availability"

export default function Calendar({ mode, siteId, checkIn, checkOut, onSelectDate }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  const isPast = (d) =>
    new Date(year, month, d) <
    new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const prevMonth = () =>
    month === 0 ? (setYear((y) => y - 1), setMonth(11)) : setMonth((m) => m - 1)
  const nextMonth = () =>
    month === 11 ? (setYear((y) => y + 1), setMonth(0)) : setMonth((m) => m + 1)

  return (
    <div>
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

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />
          const past = isPast(d)
          const dateKey = toKey(year, month, d)

          // 전체 모드 렌더링
          if (mode === "all") {
            const isCheckIn = checkIn === dateKey
            const isCheckOut = checkOut === dateKey
            const inRange =
              checkIn && checkOut && dateKey > checkIn && dateKey < checkOut

            return (
              <button
                key={d}
                disabled={past}
                onClick={() => onSelectDate(dateKey)}
                className="flex justify-center py-0.5"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                    isCheckIn || isCheckOut
                      ? "bg-primary text-white"
                      : inRange
                        ? "bg-gray-100 text-gray-700"
                        : past
                          ? "text-gray-200"
                          : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {d}
                </div>
              </button>
            )
          }

          // 사이트 모드 렌더링
          const avail = !past && (AVAILABILITY[siteId]?.[dateKey] ?? false)
          const isCheckIn = checkIn === dateKey
          const isCheckOut = checkOut === dateKey
          const inRange =
            checkIn && checkOut && dateKey > checkIn && dateKey < checkOut
          const disabled2 = past || !avail

          let circleStyle = ""
          let textStyle
          if (isCheckIn || isCheckOut) {
            circleStyle = "bg-primary"
            textStyle = "text-white"
          } else if (inRange) {
            circleStyle = "bg-gray-100"
            textStyle = "text-gray-700"
          } else if (avail) {
            circleStyle = "hover:bg-gray-100"
            textStyle = "text-gray-700"
          } else {
            textStyle = past ? "text-gray-200" : "text-gray-300 line-through"
          }

          return (
            <button
              key={d}
              disabled={disabled2}
              onClick={() => onSelectDate(dateKey)}
              className="flex justify-center py-0.5"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${circleStyle} ${textStyle}`}
              >
                {d}
              </div>
            </button>
          )
        })}
      </div>

      {mode === "site" && (
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary" />
            <span className="text-xs text-gray-400">예약 가능</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs line-through text-gray-300">15</span>
            <span className="text-xs text-gray-400">예약 불가</span>
          </div>
        </div>
      )}
    </div>
  )
}
