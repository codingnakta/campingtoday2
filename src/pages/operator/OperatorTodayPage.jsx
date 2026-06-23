import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"
import { DUMMY_RESERVATIONS } from "../../data/reservations"

const TODAY = "2026-06-23"

export default function OperatorTodayPage() {
  const navigate = useNavigate()

  const checkIns = DUMMY_RESERVATIONS.filter(
    (r) => r.checkIn === TODAY && r.status !== "취소"
  )
  const checkOuts = DUMMY_RESERVATIONS.filter(
    (r) => r.checkOut === TODAY && r.status !== "취소"
  )

  const Card = ({ r }) => (
    <div className="bg-surface rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-gray-800">{r.name}</span>
        <span className="text-xs text-gray-400">{r.phone}</span>
      </div>
      <div className="text-sm text-gray-500 flex justify-between">
        <span>{r.site}번 사이트 · {r.type}</span>
        <span>{r.people}명</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
        <span className="text-base font-bold text-gray-700">오늘 입실/퇴실 목록</span>
      </header>

      <div className="px-4 py-4 space-y-6">
        <section>
          <h2 className="text-xs text-gray-400 font-semibold mb-2">
            오늘 입실 ({checkIns.length}명)
          </h2>
          {checkIns.length === 0 ? (
            <p className="text-sm text-gray-300 py-4 text-center">오늘 입실 없음</p>
          ) : (
            <div className="flex flex-col gap-3">
              {checkIns.map((r) => <Card key={r.id} r={r} />)}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xs text-gray-400 font-semibold mb-2">
            오늘 퇴실 ({checkOuts.length}명)
          </h2>
          {checkOuts.length === 0 ? (
            <p className="text-sm text-gray-300 py-4 text-center">오늘 퇴실 없음</p>
          ) : (
            <div className="flex flex-col gap-3">
              {checkOuts.map((r) => <Card key={r.id} r={r} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
