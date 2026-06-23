import { useState } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"
import { DUMMY_RESERVATIONS } from "../../data/reservations"

function getCancelInfo(reservation) {
  const cancelDate = new Date(
    reservation.cancelRequestedAt?.split(" ")[0] ?? new Date().toISOString().slice(0, 10)
  )
  const checkInDate = new Date(reservation.checkIn)
  const daysUntil = Math.floor((checkInDate - cancelDate) / (1000 * 60 * 60 * 24))

  const priceNum = parseInt(reservation.price.replace(/,/g, ""), 10)

  let feeRate = 0
  if (daysUntil < 1) feeRate = 1.0
  else if (daysUntil <= 2) feeRate = 0.5
  else if (daysUntil <= 6) feeRate = 0.3

  const isLastMinute = feeRate > 0
  const feeAmount = Math.floor(priceNum * feeRate)
  const refundAmount = priceNum - feeAmount

  return { daysUntil, isLastMinute, feeRate, feeAmount, refundAmount, priceNum }
}

function CancelApproveModal({ reservation, onConfirm, onClose }) {
  if (!reservation) return null

  const { daysUntil, isLastMinute, feeRate, feeAmount, refundAmount, priceNum } =
    getCancelInfo(reservation)

  const fmt = (n) => n.toLocaleString()

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="bg-white w-full max-w-sm rounded-t-3xl p-6 pb-10">
        <h2 className="text-base font-bold text-gray-800 mb-0.5">취소 요청 승인</h2>
        <p className="text-sm text-gray-400 mb-4">
          {reservation.name} · {reservation.site}번 사이트
        </p>

        {isLastMinute && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
            <p className="text-xs font-semibold text-red-500 mb-3">
              ⚠️ 체크인 {daysUntil}일 전 취소 — 위약금이 발생합니다
            </p>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>결제 금액</span>
                <span>{fmt(priceNum)}원</span>
              </div>
              <div className="flex justify-between text-red-500 font-semibold">
                <span>위약금 ({Math.round(feeRate * 100)}%)</span>
                <span>- {fmt(feeAmount)}원</span>
              </div>
              <div className="border-t border-red-100 pt-2 flex justify-between font-bold text-gray-800">
                <span>환불 금액</span>
                <span>{fmt(refundAmount)}원</span>
              </div>
            </div>
          </div>
        )}

        {refundAmount > 0 && reservation.refundAccount && (
          <div className="bg-gray-50 rounded-2xl px-4 py-3 mb-4">
            <p className="text-xs text-gray-400 mb-2">환불 계좌</p>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">은행</span>
                <span className="font-semibold">{reservation.refundAccount.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">계좌번호</span>
                <span className="font-semibold">{reservation.refundAccount.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">예금주</span>
                <span className="font-semibold">{reservation.refundAccount.accountHolder}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-700 font-semibold text-center mb-6">
          {refundAmount > 0
            ? `${fmt(refundAmount)}원 환불이 완료되었나요?`
            : "환불 없이 취소 처리 하시겠습니까?"}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-500"
          >
            아니요
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
          >
            {refundAmount > 0 ? "환불 완료" : "취소 처리"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OperatorCancelPage() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState(DUMMY_RESERVATIONS)
  const [pendingApprove, setPendingApprove] = useState(null)

  const requests = reservations.filter((r) => r.status === "취소요청")

  const handleApproveConfirm = () => {
    if (!pendingApprove) return
    setReservations((prev) =>
      prev.map((r) => (r.id === pendingApprove.id ? { ...r, status: "취소" } : r))
    )
    setPendingApprove(null)
  }

  const handleReject = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.previousStatus ?? "확정" } : r))
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
        <span className="text-base font-bold text-gray-700">취소 요청</span>
      </header>

      <div className="px-4 py-4 flex flex-col gap-3">
        {requests.length === 0 ? (
          <p className="text-center text-sm text-gray-300 py-16">취소 요청이 없습니다</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="bg-surface rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">{r.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-600">
                  취소요청
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>{r.site}번 사이트 · {r.type}</span>
                  <span>{r.people}명</span>
                </div>
                <div className="flex justify-between">
                  <span>{r.checkIn} ~ {r.checkOut}</span>
                  <span className="font-semibold text-gray-700">{r.price}원</span>
                </div>
                <p className="text-xs text-gray-300">취소 요청 {r.cancelRequestedAt}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(r.id)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500"
                >
                  반려
                </button>
                <button
                  onClick={() => setPendingApprove(r)}
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-semibold"
                >
                  취소 승인
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CancelApproveModal
        reservation={pendingApprove}
        onConfirm={handleApproveConfirm}
        onClose={() => setPendingApprove(null)}
      />
    </div>
  )
}
