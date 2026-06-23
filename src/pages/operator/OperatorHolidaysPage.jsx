import { useState } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"

const TODAY = new Date("2026-06-23")

function getMonthDays(year, month) {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  return { first, days }
}

function fmt(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

export default function OperatorHolidaysPage() {
  const navigate = useNavigate()
  const [year, setYear] = useState(TODAY.getFullYear())
  const [month, setMonth] = useState(TODAY.getMonth())
  const [holidays, setHolidays] = useState(new Set())

  const { first, days } = getMonthDays(year, month)

  const toggle = (dateStr) => {
    setHolidays((prev) => {
      const next = new Set(prev)
      next.has(dateStr) ? next.delete(dateStr) : next.add(dateStr)
      return next
    })
  }

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
        <span className="text-base font-bold text-gray-700">휴무일 설정</span>
      </header>

      <div className="px-4 py-4">
        <div className="bg-surface rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-gray-400">
              ‹
            </button>
            <span className="font-bold text-gray-700">{year}년 {month + 1}월</span>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-gray-400">
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <span key={d} className="text-xs text-gray-400 py-1">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center gap-y-1">
            {Array.from({ length: first }).map((_, i) => (
              <span key={`e${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
              const dateStr = fmt(year, month, d)
              const isHoliday = holidays.has(dateStr)
              return (
                <button
                  key={d}
                  onClick={() => toggle(dateStr)}
                  className={`mx-auto w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors ${
                    isHoliday
                      ? "bg-red-500 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        {holidays.size > 0 && (
          <div className="mt-4 bg-surface rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-2">설정된 휴무일</p>
            <div className="flex flex-wrap gap-2">
              {[...holidays].sort().map((d) => (
                <span key={d} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
