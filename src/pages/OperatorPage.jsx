import { useNavigate } from "react-router-dom"
import iconBack from "../assets/back.png"

export default function OperatorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
        <span className="text-base font-bold text-gray-700">운영</span>
      </header>
      <div className="w-full p-4 bg-white my-2">안녕하세요.</div>
    </div>
  )
}
