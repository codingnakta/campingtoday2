import { useState } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"
import { DUMMY_RESERVATIONS } from "../../data/reservations"

const STATUS_TABS = ["전체", "대기중", "확정", "취소요청", "취소"]

const statusColor = {
  대기중: "bg-[#fcb825] text-white",
  확정: "bg-green-700 text-white",
  취소요청: "bg-red-500 text-white",
  취소: "bg-gray-100 text-gray-400",
}

const statusDot = {
  대기중: "bg-yellow-400",
  확정: "bg-green-500",
  취소요청: "bg-red-400",
  취소: "bg-gray-300",
}

function getMonthDays(year, month) {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  return { first, days }
}

function fmt(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function CalendarView({ reservations }) {
  const today = new Date("2026-06-23")
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(null)

  const { first, days } = getMonthDays(year, month)

  const byDate = {}
  reservations.forEach((r) => {
    const start = new Date(r.checkIn)
    const end = new Date(r.checkOut)
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10)
      if (!byDate[key]) byDate[key] = []
      byDate[key].push(r)
    }
  })

  const selectedDateStr = selected ? fmt(year, month, selected) : null
  const selectedReservations = selectedDateStr
    ? (byDate[selectedDateStr] ?? [])
    : []

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1)
      setMonth(11)
    } else setMonth((m) => m - 1)
    setSelected(null)
  }
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1)
      setMonth(0)
    } else setMonth((m) => m + 1)
    setSelected(null)
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="bg-surface rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center text-gray-400 text-lg"
          >
            ‹
          </button>
          <span className="font-bold text-gray-700">
            {year}년 {month + 1}월
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center text-gray-400 text-lg"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 text-center mb-1">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <span key={d} className="text-xs text-gray-400 py-1">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center gap-y-1">
          {Array.from({ length: first }).map((_, i) => (
            <span key={`e${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
            const dateStr = fmt(year, month, d)
            const entries = byDate[dateStr] ?? []
            const isSelected = selected === d
            return (
              <button
                key={d}
                onClick={() => setSelected(isSelected ? null : d)}
                className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center transition-colors relative text-sm
                  ${isSelected ? "bg-primary text-white" : entries.length > 0 ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDateStr && (
        <div>
          <p className="text-xs text-gray-400 font-semibold mb-2">
            {selectedDateStr} 예약 {selectedReservations.length}건
          </p>
          {selectedReservations.length === 0 ? (
            <p className="text-sm text-gray-300 text-center py-6">예약 없음</p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedReservations.map((r) => (
                <div
                  key={r.id}
                  className="bg-surface rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-800">{r.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <div className="flex justify-between">
                      <span>
                        {r.site}번 · {r.type}
                      </span>
                      <span>{r.people}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {r.checkIn} ~ {r.checkOut}
                      </span>
                      <span className="font-semibold text-gray-700">
                        {r.price}원
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ListView({ reservations }) {
  const [tab, setTab] = useState("전체")

  const filtered =
    tab === "전체" ? reservations : reservations.filter((r) => r.status === tab)

  return (
    <>
      <div className="bg-surface px-4 py-3 border-b border-gray-100 sticky top-12 z-10">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {STATUS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                tab === t
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-gray-500 border-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-300 py-16">예약 없음</p>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-surface rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">{r.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>
                    {r.site}번 사이트 · {r.type}
                  </span>
                  <span>{r.people}명</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {r.checkIn} ~ {r.checkOut}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {r.price}원
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  {r.phone} · 신청 {r.requestedAt}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default function OperatorReservationsPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState("calendar")

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-surface px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
          </button>
          <span className="text-base font-bold text-gray-700">전체 예약</span>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${viewMode === "calendar" ? "bg-white text-gray-700 shadow-sm" : "text-gray-400"}`}
          >
            캘린더
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${viewMode === "list" ? "bg-white text-gray-700 shadow-sm" : "text-gray-400"}`}
          >
            건별보기
          </button>
        </div>
      </header>

      {viewMode === "calendar" ? (
        <CalendarView reservations={DUMMY_RESERVATIONS} />
      ) : (
        <ListView reservations={DUMMY_RESERVATIONS} />
      )}
    </div>
  )
}
