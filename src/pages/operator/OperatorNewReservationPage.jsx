import { useState } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"
import { SITE_LIST } from "../../data/sites"

export default function OperatorNewReservationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    site: "",
    checkIn: "",
    checkOut: "",
    name: "",
    phone: "",
    people: 2,
  })

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const nights =
    form.checkIn && form.checkOut
      ? Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000)
      : 0

  const selectedSite = SITE_LIST.find((s) => s.id === Number(form.site))
  const totalPrice =
    selectedSite && nights > 0
      ? (parseInt(selectedSite.price.replace(",", "")) * nights).toLocaleString()
      : null

  const canSubmit = form.site && form.checkIn && form.checkOut && form.name && form.phone && nights > 0

  return (
    <div className="min-h-screen bg-page pb-28">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
        <span className="text-base font-bold text-gray-700">직접 예약 등록</span>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="bg-surface rounded-2xl p-4 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">사이트 선택</p>
            <select
              value={form.site}
              onChange={(e) => set("site", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-surface"
            >
              <option value="">사이트를 선택하세요</option>
              {SITE_LIST.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}번 · {s.type} ({s.price}원/박)
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">체크인</p>
              <input
                type="date"
                value={form.checkIn}
                onChange={(e) => set("checkIn", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-surface"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">체크아웃</p>
              <input
                type="date"
                value={form.checkOut}
                onChange={(e) => set("checkOut", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-surface"
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">이름</p>
            <input
              type="text"
              placeholder="예) 홍길동"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-surface"
            />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">연락처</p>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-surface"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">인원</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => set("people", Math.max(1, form.people - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 text-lg"
              >
                -
              </button>
              <span className="text-sm font-semibold text-gray-700 w-4 text-center">
                {form.people}
              </span>
              <button
                onClick={() => set("people", form.people + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {totalPrice && (
          <div className="bg-surface rounded-2xl p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">요금 안내</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{selectedSite?.price}원 × {nights}박</span>
              <span>{totalPrice}원</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="text-sm font-semibold text-gray-700">합계</span>
              <span className="text-sm font-bold text-gray-800">{totalPrice}원</span>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface px-4 py-3">
        <button
          disabled={!canSubmit}
          onClick={() => navigate(-1)}
          className="w-full h-12 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-30"
        >
          예약 등록하기
        </button>
      </div>
    </div>
  )
}
