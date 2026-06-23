import { useNavigate } from "react-router-dom"
import iconBack from "../assets/back.png"
import { useNotices } from "../data/useNotices"

export default function NoticesPage() {
  const navigate = useNavigate()
  const { notices } = useNotices()

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
        <span className="text-base font-bold text-gray-700">공지사항</span>
      </header>

      <div className="flex flex-col divide-y divide-gray-100">
        {notices.length === 0 ? (
          <p className="text-center text-sm text-gray-300 py-20">공지사항이 없습니다</p>
        ) : (
          notices.map((n) => (
            <button
              key={n.id}
              onClick={() => navigate(`/notices/${n.id}`)}
              className="bg-surface px-4 py-4 text-left flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {n.pinned && (
                    <span className="text-xs font-semibold text-primary shrink-0">공지</span>
                  )}
                  <p className={`text-sm truncate ${n.pinned ? "font-semibold text-gray-800" : "text-gray-700"}`}>
                    {n.title}
                  </p>
                </div>
                <p className="text-xs text-gray-400">{n.createdAt}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
