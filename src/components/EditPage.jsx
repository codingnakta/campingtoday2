import { useState, useMemo } from "react"
import { SITE_LIST } from "../data/sites"
import { getSitesAvailableForEdit } from "../utils/siteFilter"
import Calendar from "./Calendar"

export default function EditPage({ reservation, reservations, onSave, onBack }) {
  const [checkIn, setCheckIn] = useState(reservation.checkIn)
  const [checkOut, setCheckOut] = useState(reservation.checkOut)
  const [step, setStep] = useState("checkin")
  const [people, setPeople] = useState(reservation.people)
  const [name, setName] = useState(reservation.name)
  const [phone, setPhone] = useState(reservation.phone)

  const availableSites = useMemo(
    () => getSitesAvailableForEdit(checkIn, checkOut, reservation.id, reservations),
    [checkIn, checkOut, reservation.id, reservations]
  )

  const [siteId, setSiteId] = useState(() => {
    const initial = getSitesAvailableForEdit(
      reservation.checkIn,
      reservation.checkOut,
      reservation.id,
      reservations
    )
    return initial.some((s) => s.id === reservation.site) ? reservation.site : null
  })

  const resetDates = () => {
    setCheckIn("")
    setCheckOut("")
    setSiteId(null)
    setStep("checkin")
  }

  const handleDateSelect = (date) => {
    if (step === "checkin") {
      if (date === checkIn) {
        resetDates()
      } else {
        setCheckIn(date)
        setCheckOut("")
        setSiteId(null)
        setStep("checkout")
      }
    } else {
      if (date === checkOut) {
        setCheckOut("")
        setSiteId(null)
      } else if (date < checkIn) {
        setCheckIn(date)
        setCheckOut(checkIn)
        setSiteId(null)
        setStep("checkin")
      } else if (date === checkIn) {
        resetDates()
      } else {
        setCheckOut(date)
        setSiteId(null)
        setStep("checkin")
      }
    }
  }

  const selectedSiteInfo = siteId ? SITE_LIST.find((s) => s.id === siteId) : null

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    return Math.round(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    )
  }, [checkIn, checkOut])

  const totalPrice = useMemo(() => {
    if (!selectedSiteInfo || nights === 0) return null
    return (
      parseInt(selectedSiteInfo.price.replace(",", "")) * nights
    ).toLocaleString()
  }, [selectedSiteInfo, nights])

  const canSave = !!siteId && !!checkIn && !!checkOut && !!name && !!phone

  const handleSave = () => {
    onSave({
      ...reservation,
      site: siteId,
      type: selectedSiteInfo?.type ?? reservation.type,
      checkIn,
      checkOut,
      nights,
      price: totalPrice ?? reservation.price,
      people,
      name,
      phone,
    })
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-page pb-28">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm"
        >
          ←
        </button>
        <span className="text-base font-bold text-gray-700">예약 수정</span>
        <span className="text-xs text-gray-400 ml-1">
          #{reservation.id} {reservation.name}
        </span>
      </header>

      {/* 날짜 선택 */}
      <section className="bg-surface mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">날짜 선택</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={resetDates}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-colors ${
              step === "checkin" && !checkIn
                ? "border-primary bg-primary-light"
                : checkIn
                  ? "border-gray-300 bg-surface"
                  : "border-gray-200"
            }`}
          >
            <p className="text-xs text-gray-400 mb-0.5">체크인</p>
            <p className={`text-sm font-semibold ${checkIn ? "text-gray-700" : "text-gray-300"}`}>
              {checkIn || "날짜 선택"}
            </p>
          </button>
          <button
            onClick={() => {
              if (checkIn) {
                setCheckOut("")
                setSiteId(null)
                setStep("checkout")
              }
            }}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-colors ${
              step === "checkout"
                ? "border-primary bg-primary-light"
                : checkOut
                  ? "border-gray-300 bg-surface"
                  : "border-gray-200"
            }`}
          >
            <p className="text-xs text-gray-400 mb-0.5">체크아웃</p>
            <p className={`text-sm font-semibold ${checkOut ? "text-gray-700" : "text-gray-300"}`}>
              {checkOut || "날짜 선택"}
            </p>
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-4 text-center">
          {step === "checkin" ? "체크인 날짜를 선택하세요" : "체크아웃 날짜를 선택하세요"}
        </p>
        <Calendar
          mode="all"
          checkIn={checkIn}
          checkOut={checkOut}
          onSelectDate={handleDateSelect}
        />
        {nights > 0 && (
          <p className="text-center text-xs text-gray-500 mt-3 font-semibold">
            {nights}박 선택됨
          </p>
        )}
      </section>

      {/* 사이트 선택 */}
      <section className="bg-surface mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">사이트 선택</h2>
        {!checkIn || !checkOut ? (
          <p className="text-xs text-gray-400 text-center py-2">
            날짜를 선택하면 이용 가능한 사이트를 표시합니다
          </p>
        ) : availableSites.length === 0 ? (
          <p className="text-xs text-gray-300 text-center py-4">
            선택 기간에 예약 가능한 사이트가 없습니다
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {availableSites.map((site) => (
              <button
                key={site.id}
                onClick={() => setSiteId(site.id)}
                className={`flex items-center justify-between border rounded-xl px-3 py-3 transition-colors ${
                  siteId === site.id
                    ? "border-primary bg-primary-light"
                    : "border-stone-200 bg-surface hover:bg-primary-light"
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      siteId === site.id ? "bg-primary" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold ${siteId === site.id ? "text-white" : "text-gray-500"}`}
                    >
                      {site.id}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {site.name} · {site.type}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-700">
                  {site.price}원
                  <span className="font-normal text-gray-400">/박</span>
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 예약자 정보 */}
      <section className="bg-surface mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">예약자 정보</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">인원</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 text-lg"
              >
                -
              </button>
              <span className="text-sm font-semibold text-gray-700 w-4 text-center">
                {people}
              </span>
              <button
                onClick={() => setPeople((p) => p + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 text-lg"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">이름</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-surface"
            />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">연락처</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-surface"
            />
          </div>
        </div>
      </section>

      {/* 요금 안내 */}
      {selectedSiteInfo && checkIn && checkOut && totalPrice && (
        <section className="bg-surface mt-2 px-4 py-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">요금 안내</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs text-gray-400">사이트</span>
              <span className="text-xs font-semibold text-gray-700">
                {selectedSiteInfo.id}번 · {selectedSiteInfo.type}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">기간</span>
              <span className="text-xs text-gray-700">
                {checkIn} ~ {checkOut} ({nights}박)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {selectedSiteInfo.price}원 × {nights}박
              </span>
              <span className="text-xs text-gray-700">{totalPrice}원</span>
            </div>
            <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between">
              <span className="text-sm font-semibold text-gray-700">합계</span>
              <span className="text-sm font-bold text-gray-700">{totalPrice}원</span>
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-surface border-t border-gray-200 px-4 py-3">
        <button
          disabled={!canSave}
          onClick={handleSave}
          className="w-full h-12 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-30"
        >
          수정 완료
        </button>
      </div>
    </div>
  )
}
