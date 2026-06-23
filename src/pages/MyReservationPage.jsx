import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DUMMY_RESERVATIONS } from "../data/reservations"
import iconBack from "../assets/back.png"

const STATUS_STYLE = {
  확정: "bg-primary text-white",
  대기중: "bg-yellow-100 text-yellow-700",
  취소요청: "bg-orange-100 text-orange-600",
  취소: "bg-gray-100 text-gray-400",
}

export default function MyReservationPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState([])
  const [confirmingId, setConfirmingId] = useState(null)

  const handleCancel = (id) => {
    setResults((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, previousStatus: r.status, status: "취소요청" }
          : r,
      ),
    )
    setConfirmingId(null)
  }

  const handleSearch = () => {
    const trimName = name.trim()
    const trimPhone = phone.trim()
    if (!trimName || !trimPhone) return

    const found = DUMMY_RESERVATIONS.filter(
      (r) => r.name === trimName && r.phone === trimPhone,
    )
    setResults(found)
    setSearched(true)
  }

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    let formatted
    if (raw.length <= 3) {
      formatted = raw
    } else if (raw.length <= 7) {
      formatted = raw.slice(0, 3) + "-" + raw.slice(3)
    } else {
      formatted =
        raw.slice(0, 3) + "-" + raw.slice(3, 7) + "-" + raw.slice(7, 11)
    }
    setPhone(formatted)
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
        <span className="text-base font-bold text-gray-700">예약 확인</span>
      </header>

      <div className="bg-surface mt-2 mx-4 rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">
          예약 시 입력한 정보를 입력해 주세요
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setSearched(false)
              }}
              placeholder="예) 홍길동"
              className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm text-gray-700 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">전화번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                handlePhoneChange(e)
                setSearched(false)
              }}
              placeholder="예) 010-1234-5678"
              maxLength={13}
              className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm text-gray-700 outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!name.trim() || phone.replace(/-/g, "").length < 10}
            className="w-full h-11 bg-primary text-white rounded-xl text-sm font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            조회하기
          </button>
        </div>
      </div>

      {searched && (
        <div className="mx-4 mt-4 pb-8">
          {results.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-2">
              <p className="text-sm font-semibold text-gray-500">
                예약 내역이 없습니다
              </p>
              <p className="text-xs text-gray-400 text-center">
                이름과 전화번호를 다시 확인해 주세요
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-700 px-1">
                총 {results.length}건의 예약이 있습니다
              </p>
              {results.map((r) => {
                const canCancel = r.status !== "취소" && r.status !== "취소요청"
                return (
                  <div
                    key={r.id}
                    className="bg-surface rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-gray-700">
                          {r.site}번 사이트
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.type}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[r.status] ?? "bg-gray-100 text-gray-400"}`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                      {[
                        ["체크인", r.checkIn],
                        ["체크아웃", r.checkOut],
                        ["숙박", `${r.nights}박`],
                        ["인원", `${r.people}명`],
                        ["금액", `${r.price}원`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-xs text-gray-400">{label}</span>
                          <span className="text-xs font-medium text-gray-700">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-300 mt-3 text-right">
                      신청일 {r.requestedAt}
                    </p>

                    {r.status === "대기중" && (
                      <div className="mt-3 bg-yellow-50 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-yellow-700">
                          예약 확정 후 안내 문자를 발송해 드립니다. 문의:
                          033-000-0000
                        </p>
                      </div>
                    )}

                    {r.status === "취소요청" && (
                      <div className="mt-3 bg-orange-50 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-orange-600 font-semibold">
                          취소 요청이 접수되었습니다
                        </p>
                        <p className="text-xs text-orange-400 mt-0.5">
                          관리자 확인 후 환불이 처리됩니다. 문의: 033-000-0000
                        </p>
                      </div>
                    )}

                    {canCancel && (
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        {confirmingId === r.id ? (
                          <div className="bg-red-50 rounded-xl px-3 py-3 flex flex-col gap-2">
                            <p className="text-xs text-red-600 font-semibold">
                              예약을 취소하시겠습니까?
                            </p>
                            <p className="text-xs text-red-400">
                              취소 후에는 되돌릴 수 없습니다.
                            </p>
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => setConfirmingId(null)}
                                className="flex-1 h-9 rounded-lg border border-gray-200 text-xs text-gray-500 font-semibold bg-white"
                              >
                                돌아가기
                              </button>
                              <button
                                onClick={() => handleCancel(r.id)}
                                className="flex-1 h-9 rounded-lg bg-red-500 text-white text-xs font-semibold"
                              >
                                취소 확정
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmingId(r.id)}
                            className="w-full h-10 rounded-xl border border-red-200 text-red-500 text-xs font-semibold bg-red-50"
                          >
                            예약 취소
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
