import { useState } from "react"
import { STATUS_FILTERS } from "../utils/status"
import { toDateInputStr } from "../utils/date"
import ReservationRow from "./ReservationRow"

export default function ListView({ reservations, search, onSearch, onSelect }) {
  const [statusFilter, setStatusFilter] = useState(null)

  const defaultEnd = new Date()
  const defaultStart = new Date()
  defaultStart.setMonth(defaultStart.getMonth() - 1)
  const [startDate, setStartDate] = useState(toDateInputStr(defaultStart))
  const [endDate, setEndDate] = useState(toDateInputStr(defaultEnd))
  const [allRange, setAllRange] = useState(false)
  const [sortBy, setSortBy] = useState("latest")

  const handleStartDate = (v) => {
    setStartDate(v)
    setAllRange(false)
  }
  const handleEndDate = (v) => {
    setEndDate(v)
    setAllRange(false)
  }
  const resetRange = () => {
    setStartDate(toDateInputStr(defaultStart))
    setEndDate(toDateInputStr(defaultEnd))
    setAllRange(false)
  }

  const filtered = [...reservations]
    .filter((r) => (search ? r.name.includes(search) : true))
    .filter((r) => statusFilter === null || r.status === statusFilter)
    .filter(
      (r) =>
        allRange ||
        (r.requestedAt.slice(0, 10) >= startDate &&
          r.requestedAt.slice(0, 10) <= endDate),
    )
    .sort((a, b) => {
      if (sortBy === "latest") return b.requestedAt.localeCompare(a.requestedAt)
      if (sortBy === "oldest") return a.requestedAt.localeCompare(b.requestedAt)
      if (sortBy === "checkin") return a.checkIn.localeCompare(b.checkIn)
      return 0
    })

  return (
    <div>
      {/* 검색 */}
      <div className="bg-surface px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="예약자 이름으로 검색"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="text-gray-400 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 날짜 범위 */}
      <div className="bg-surface px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-600">
            신청일 기간
          </span>
          <div className="flex gap-1 ml-auto">
            <button
              onClick={resetRange}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                !allRange
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-gray-400 border-gray-200"
              }`}
            >
              날짜 선택
            </button>
            <button
              onClick={() => setAllRange(true)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                allRange
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-gray-400 border-gray-200"
              }`}
            >
              전체
            </button>
          </div>
        </div>
        {!allRange && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDate(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 bg-surface"
            />
            <span className="text-gray-300 text-xs shrink-0">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDate(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 bg-surface"
            />
          </div>
        )}
      </div>

      {/* 상태 필터 */}
      <div className="bg-surface px-4 py-3 border-b border-gray-100 flex gap-2">
        <button
          onClick={() => setStatusFilter(null)}
          className={`flex-1 h-8 rounded-lg text-xs font-semibold border transition-colors ${
            statusFilter === null
              ? "bg-primary text-white border-primary"
              : "bg-surface text-gray-400 border-gray-200"
          }`}
        >
          전체
        </button>
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(statusFilter === status ? null : status)
            }
            className={`flex-1 h-8 rounded-lg text-xs font-semibold border transition-colors ${
              statusFilter === status
                ? "bg-primary text-white border-primary"
                : "bg-surface text-gray-400 border-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-400">총 {filtered.length}건</p>
          <div className="flex gap-1">
            {[
              { key: "latest", label: "최신순" },
              { key: "oldest", label: "예약빠른순" },
              { key: "checkin", label: "체크인순" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                  sortBy === opt.key
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-gray-400 border-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-xs text-gray-300 py-12">
            예약 내역이 없습니다
          </p>
        ) : (
          filtered.map((r) => (
            <ReservationRow key={r.id} r={r} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  )
}
