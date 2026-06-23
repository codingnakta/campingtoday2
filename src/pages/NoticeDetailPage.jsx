import { useNavigate, useParams } from "react-router-dom"
import iconBack from "../assets/back.png"
import { useNotices } from "../data/useNotices"

export default function NoticeDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { notices } = useNotices()

  const notice = notices.find((n) => String(n.id) === id)

  if (!notice) {
    return (
      <div className="min-h-screen bg-page flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-400">존재하지 않는 공지입니다.</p>
        <button onClick={() => navigate(-1)} className="text-xs text-primary">돌아가기</button>
      </div>
    )
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
        <span className="text-base font-bold text-gray-700">공지사항</span>
      </header>

      <div className="bg-surface px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-1.5 mb-2">
          {notice.pinned && (
            <span className="text-xs font-semibold text-primary">공지</span>
          )}
        </div>
        <h1 className="text-lg font-bold text-gray-800 leading-snug">{notice.title}</h1>
        <p className="text-xs text-gray-400 mt-2">{notice.createdAt}</p>
      </div>

      <div className="bg-surface mt-2 px-4 py-5">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {notice.content}
        </p>
      </div>
    </div>
  )
}
