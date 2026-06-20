import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { SITE_LIST } from "../data/sites"
import { getSitesAvailableForRange } from "../utils/siteFilter"
import Calendar from "../components/Calendar"

export default function ReservationPage() {
  const navigate = useNavigate()
  const [siteFilter, setSiteFilter] = useState(null)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [step, setStep] = useState("checkin")
  const [people, setPeople] = useState(2)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const resetDates = () => {
    setCheckIn("")
    setCheckOut("")
    setStep("checkin")
  }

  const handleChipSelect = (id) => {
    setSiteFilter(id)
    resetDates()
  }

  const handleAllChip = () => {
    setSiteFilter(null)
    resetDates()
  }

  const handleDateSelect = (date) => {
    if (step === "checkin") {
      if (date === checkIn) {
        resetDates()
      } else {
        setCheckIn(date)
        setCheckOut("")
        setStep("checkout")
      }
    } else {
      if (date === checkOut) {
        setCheckOut("")
      } else if (date < checkIn) {
        setCheckIn(date)
        setCheckOut(checkIn)
        setStep("checkin")
      } else if (date === checkIn) {
        resetDates()
      } else {
        setCheckOut(date)
        setStep("checkin")
      }
    }
  }

  const availableSites =
    siteFilter === null && checkIn && checkOut
      ? getSitesAvailableForRange(checkIn, checkOut)
      : []
  const selectedSiteInfo = siteFilter
    ? SITE_LIST.find((s) => s.id === siteFilter)
    : null

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

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-page pb-28">
      {/* 헤더 */}
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm"
        >
          ←
        </button>
        <span className="text-base font-bold text-gray-700">예약하기</span>
      </header>

      {/* 사이트 필터 칩 */}
      <div className="bg-surface px-4 py-3 border-b border-gray-100 sticky top-12 z-10">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={handleAllChip}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              siteFilter === null
                ? "bg-primary text-white border-primary"
                : "bg-surface text-gray-500 border-gray-300"
            }`}
          >
            전체
          </button>
          {SITE_LIST.map((site) => (
            <button
              key={site.id}
              onClick={() => handleChipSelect(site.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                siteFilter === site.id
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-gray-500 border-gray-300"
              }`}
            >
              {site.id}번
            </button>
          ))}
        </div>
        {selectedSiteInfo && (
          <div className="mt-2 flex justify-between items-center bg-page rounded-xl px-3 py-2">
            <span className="text-xs text-gray-600 font-semibold">
              {selectedSiteInfo.name} · {selectedSiteInfo.type}
            </span>
            <span className="text-xs font-bold text-gray-700">
              {selectedSiteInfo.price}원
              <span className="font-normal text-gray-400">/박</span>
            </span>
          </div>
        )}
      </div>

      {/* 캘린더 */}
      <section className="bg-surface mt-2 px-4 py-4 border-b border-gray-100">
        {siteFilter !== null && (
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
        )}

        {siteFilter === null && (
          <>
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
          </>
        )}

        <Calendar
          mode={siteFilter === null ? "all" : "site"}
          siteId={siteFilter}
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

      {/* 전체 모드 + 날짜 선택 완료 시 사이트 바텀시트 */}
      {siteFilter === null && checkIn && checkOut && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-20"
            onClick={() => setCheckOut("")}
          />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-surface rounded-t-2xl z-30 px-4 pt-4 pb-8">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h2 className="text-sm font-semibold text-gray-700 mb-0.5">
              {checkIn} ~ {checkOut}
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              기간 내 예약 가능한 사이트를 선택하세요
            </p>
            {availableSites.length === 0 ? (
              <p className="text-center text-xs text-gray-300 py-6">
                예약 가능한 사이트가 없습니다
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {availableSites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => setSiteFilter(site.id)}
                    className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-3 hover:bg-[#f2f3f8] transition-colors"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-gray-500">{site.id}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-700">
                          {site.name} · {site.type}
                        </p>
                        <p className="text-xs text-gray-400">{site.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-700">{site.price}원</p>
                      <p className="text-xs text-gray-400">/박</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 사이트 모드 + 날짜 선택 완료 시 인원 + 예약자 정보 */}
      {siteFilter !== null && checkIn && checkOut && (
        <>
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
                  placeholder="예) 홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-surface"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">연락처</p>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-surface"
                />
              </div>
            </div>
          </section>

          {totalPrice && (
            <section className="bg-surface mt-2 px-4 py-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">요금 안내</h2>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs text-gray-400">사이트</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {selectedSiteInfo?.id}번 · {selectedSiteInfo?.type}
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
                    {selectedSiteInfo?.price}원 × {nights}박
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
        </>
      )}

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface">
        <div className="max-w-sm mx-auto px-4 py-3">
          <button
            disabled={!siteFilter || !checkIn || !checkOut}
            className="w-full h-12 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-30"
          >
            예약 신청하기
          </button>
        </div>
      </div>
    </div>
  )
}
