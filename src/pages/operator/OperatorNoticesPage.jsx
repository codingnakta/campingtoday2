import { useState } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"
import { useNotices } from "../../data/useNotices"

export default function OperatorNoticesPage() {
  const navigate = useNavigate()
  const { notices, add, remove } = useNotices()
  const [view, setView] = useState("list")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [pinned, setPinned] = useState(false)

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    add({ title: title.trim(), content: content.trim(), pinned })
    setTitle("")
    setContent("")
    setPinned(false)
    setView("list")
  }

  if (view === "write") {
    return (
      <div className="min-h-screen bg-page pb-28">
        <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
          <button
            onClick={() => setView("list")}
            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
          </button>
          <span className="text-base font-bold text-gray-700">공지 작성</span>
        </header>

        <div className="px-4 py-4 flex flex-col gap-3">
          <div className="bg-surface rounded-2xl p-4 flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">제목</p>
              <input
                type="text"
                placeholder="공지 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-surface"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">내용</p>
              <textarea
                placeholder="공지 내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-surface resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">상단 고정</span>
              <button
                onClick={() => setPinned((p) => !p)}
                className={`w-12 h-6 rounded-full transition-colors relative ${pinned ? "bg-primary" : "bg-gray-200"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${pinned ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-surface px-4 py-3">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="w-full h-12 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-30"
          >
            등록하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page pb-24">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
        <span className="text-base font-bold text-gray-700">공지사항 관리</span>
      </header>

      <div className="flex flex-col divide-y divide-gray-100">
        {notices.length === 0 ? (
          <p className="text-center text-sm text-gray-300 py-20">등록된 공지가 없습니다</p>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="bg-surface px-4 py-4 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {n.pinned && <span className="text-xs font-semibold text-primary shrink-0">공지</span>}
                  <p className="text-sm text-gray-700 truncate">{n.title}</p>
                </div>
                <p className="text-xs text-gray-400">{n.createdAt}</p>
              </div>
              <button
                onClick={() => remove(n.id)}
                className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface px-4 py-3">
        <button
          onClick={() => setView("write")}
          className="w-full h-12 bg-primary text-white rounded-xl text-sm font-semibold"
        >
          공지 작성하기
        </button>
      </div>
    </div>
  )
}
