import { statusStyle } from "../utils/status"

export default function ReservationBottomSheet({
  r,
  onConfirm,
  onCancel,
  onRestore,
  onDelete,
  onClose,
  onEdit,
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-surface rounded-t-2xl z-30 px-4 pt-4 pb-8">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-base font-bold text-gray-800">{r.name}</span>
            <span className="text-xs text-gray-400 ml-2">{r.phone}</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusStyle(r.status)}`}
          >
            {r.status}
          </span>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2 mb-4">
          {[
            ["사이트", `${r.site}번 · ${r.type}`],
            ["기간", `${r.checkIn} ~ ${r.checkOut} (${r.nights}박)`],
            ["인원", `${r.people}명`],
            ["요금", `${r.price}원`],
            ["신청일", r.requestedAt],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-xs font-semibold text-gray-700">{value}</span>
            </div>
          ))}
        </div>
        {r.status === "대기중" && (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 h-11 border border-gray-300 rounded-xl text-sm text-gray-500 font-semibold"
            >
              예약 취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-11 bg-primary text-white rounded-xl text-sm font-semibold"
            >
              입금 확인 · 확정
            </button>
          </div>
        )}
        {r.status === "확정" && (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 h-11 border border-gray-300 rounded-xl text-sm text-gray-500 font-semibold"
            >
              예약 취소
            </button>
            <button
              onClick={onEdit}
              className="flex-1 h-11 bg-primary text-white rounded-xl text-sm font-semibold"
            >
              수정하기
            </button>
          </div>
        )}
        {r.status === "취소" && (
          <div className="flex gap-2">
            <button
              onClick={onRestore}
              className="flex-1 h-11 border border-gray-300 rounded-xl text-sm text-gray-600 font-semibold"
            >
              예약 복구
            </button>
            <button
              onClick={onDelete}
              className="flex-1 h-11 bg-gray-200 text-gray-500 rounded-xl text-sm font-semibold"
            >
              완전 삭제
            </button>
          </div>
        )}
      </div>
    </>
  )
}
