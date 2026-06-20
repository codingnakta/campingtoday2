import { statusStyle } from "../utils/status"

export default function ReservationRow({ r, onSelect }) {
  return (
    <button
      onClick={() => onSelect(r.id)}
      className="bg-surface rounded-xl border border-gray-200 px-3 py-3 flex items-center gap-3 w-full text-left"
    >
      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-gray-600">{r.site}번</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{r.name}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${statusStyle(r.status)}`}
          >
            {r.status}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {r.checkIn} ~ {r.checkOut} · {r.nights}박 · {r.price}원
        </p>
      </div>
      <span className="text-gray-300 text-sm shrink-0">›</span>
    </button>
  )
}
