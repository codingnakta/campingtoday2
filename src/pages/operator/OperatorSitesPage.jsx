import { useState } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"
import { SITE_LIST } from "../../data/sites"

export default function OperatorSitesPage() {
  const navigate = useNavigate()
  const [sites, setSites] = useState(
    SITE_LIST.map((s) => ({ ...s, active: true }))
  )

  const toggle = (id) => {
    setSites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
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
        <span className="text-base font-bold text-gray-700">사이트 관리</span>
      </header>

      <div className="px-4 py-4 flex flex-col gap-3">
        {sites.map((s) => (
          <div key={s.id} className="bg-surface rounded-2xl px-4 py-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-gray-800">{s.id}번 사이트</p>
              <p className="text-xs text-gray-400">{s.type} · {s.price}원/박</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold ${s.active ? "text-green-600" : "text-gray-300"}`}>
                {s.active ? "운영중" : "사용불가"}
              </span>
              <button
                onClick={() => toggle(s.id)}
                className={`w-12 h-6 rounded-full transition-colors relative ${s.active ? "bg-primary" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${s.active ? "left-7" : "left-1"}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
