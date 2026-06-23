import { useState } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"

const INITIAL = [
  { type: "한가족존", price: "60000" },
  { type: "두가족존", price: "120000" },
]

export default function OperatorPricingPage() {
  const navigate = useNavigate()
  const [prices, setPrices] = useState(INITIAL)
  const [saved, setSaved] = useState(false)

  const update = (type, val) => {
    setSaved(false)
    setPrices((prev) =>
      prev.map((p) => (p.type === type ? { ...p, price: val.replace(/\D/g, "") } : p))
    )
  }

  const handleSave = () => setSaved(true)

  return (
    <div className="min-h-screen bg-page pb-28">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
        <span className="text-base font-bold text-gray-700">요금 설정</span>
      </header>

      <div className="px-4 py-4 flex flex-col gap-3">
        {prices.map(({ type, price }) => (
          <div key={type} className="bg-surface rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-3">{type}</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => update(type, e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-surface"
              />
              <span className="text-sm text-gray-400">원 / 박</span>
            </div>
            {price && (
              <p className="text-xs text-gray-400 mt-1">
                = {Number(price).toLocaleString()}원
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface px-4 py-3">
        <button
          onClick={handleSave}
          className="w-full h-12 bg-primary text-white rounded-xl text-sm font-semibold"
        >
          {saved ? "저장 완료 ✓" : "저장하기"}
        </button>
      </div>
    </div>
  )
}
