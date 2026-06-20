import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DUMMY_RESERVATIONS } from "../data/reservations"
import ListView from "../components/ListView"
import AdminCalendarView from "../components/AdminCalendarView"
import ReservationBottomSheet from "../components/ReservationBottomSheet"
import EditPage from "../components/EditPage"

export default function AdminPage() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState(DUMMY_RESERVATIONS)
  const [tab, setTab] = useState("건별")
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const pendingCount = reservations.filter((r) => r.status === "대기중").length
  const selectedReservation = reservations.find((r) => r.id === selectedId)
  const editingReservation = reservations.find((r) => r.id === editingId)

  const handleConfirm = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "확정" } : r))
    )
    setSelectedId(null)
  }
  const handleCancel = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "취소" } : r))
    )
    setSelectedId(null)
  }
  const handleRestore = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "대기중" } : r))
    )
    setSelectedId(null)
  }
  const handleDelete = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id))
    setSelectedId(null)
  }
  const handleEdit = (id) => {
    setSelectedId(null)
    setEditingId(id)
  }
  const handleSave = (updated) => {
    setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    setEditingId(null)
  }

  if (editingReservation) {
    return (
      <EditPage
        reservation={editingReservation}
        reservations={reservations}
        onSave={handleSave}
        onBack={() => setEditingId(null)}
      />
    )
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-page pb-8">
      {/* 헤더 */}
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm"
        >
          ←
        </button>
        <span className="text-base font-bold text-gray-700">예약 관리</span>
        {pendingCount > 0 && (
          <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
            대기 {pendingCount}건
          </span>
        )}
      </header>

      {/* 탭 */}
      <div className="bg-surface flex border-b border-gray-100">
        {["건별보기", "캘린더보기"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t === "건별보기" ? "건별" : "캘린더")
              setSearch("")
            }}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
              (t === "건별보기" ? tab === "건별" : tab === "캘린더")
                ? "border-primary text-primary"
                : "border-transparent text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 내용 */}
      {tab === "건별" ? (
        <ListView
          reservations={reservations}
          search={search}
          onSearch={setSearch}
          onSelect={setSelectedId}
        />
      ) : (
        <AdminCalendarView reservations={reservations} onSelect={setSelectedId} />
      )}

      {/* 상세 바텀시트 */}
      {selectedId && selectedReservation && (
        <ReservationBottomSheet
          r={selectedReservation}
          onConfirm={() => handleConfirm(selectedReservation.id)}
          onCancel={() => handleCancel(selectedReservation.id)}
          onRestore={() => handleRestore(selectedReservation.id)}
          onDelete={() => handleDelete(selectedReservation.id)}
          onEdit={() => handleEdit(selectedReservation.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
