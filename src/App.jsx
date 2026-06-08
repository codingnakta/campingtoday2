import { useState, useMemo } from "react"

const SITE_LIST = [
  { id: 1, name: "1번", type: "한가족존", price: "120,000" },
  { id: 2, name: "2번", type: "한가족존", price: "120,000" },
  { id: 3, name: "3번", type: "한가족존", price: "120,000" },
  { id: 4, name: "4번", type: "한가족존", price: "120,000" },
  { id: 5, name: "5번", type: "한가족존", price: "120,000" },
  { id: 6, name: "6번", type: "한가족존", price: "120,000" },
  { id: 7, name: "7번", type: "한가족존", price: "120,000" },
  { id: 8, name: "8번", type: "한가족존", price: "120,000" },
  { id: 9, name: "9번", type: "한가족존", price: "120,000" },
  { id: 10, name: "10번", type: "두가족존", price: "240,000" },
]

const facilities = [
  "샤워실",
  "화장실",
  "개수대",
  "전기콘센트",
  "무선인터넷",
  "매점",
]
const reviews = [
  {
    id: 1,
    name: "치**스",
    rating: 5,
    text: "자연 속에서 힐링하고 왔어요. 시설도 깨끗하고 너무 좋았습니다!",
  },
  {
    id: 2,
    name: "김*수",
    rating: 4,
    text: "아이들이 너무 좋아했어요. 계곡이 가까워서 완전 만족!",
  },
]

function genAllAvailability() {
  const today = new Date()
  const result = {}
  for (let siteId = 1; siteId <= 10; siteId++) {
    result[siteId] = {}
    for (let offset = 0; offset < 60; offset++) {
      const d = new Date(today)
      d.setDate(d.getDate() + offset)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      result[siteId][key] = Math.random() > 0.35
    }
  }
  return result
}

const AVAILABILITY = genAllAvailability()
const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function getAvailableCount(dateKey) {
  return SITE_LIST.filter((s) => AVAILABILITY[s.id]?.[dateKey]).length
}

function getAvailableSites(dateKey) {
  return SITE_LIST.filter((s) => AVAILABILITY[s.id]?.[dateKey])
}

// 체크인~체크아웃 기간 동안 모든 날짜 예약 가능한 사이트
function getSitesAvailableForRange(checkIn, checkOut) {
  const dates = []
  const cur = new Date(checkIn)
  const end = new Date(checkOut)
  while (cur < end) {
    dates.push(cur.toISOString().split("T")[0])
    cur.setDate(cur.getDate() + 1)
  }
  return SITE_LIST.filter((site) =>
    dates.every((date) => AVAILABILITY[site.id]?.[date]),
  )
}

// 가용 수에 따른 배지 색상
function countBadgeStyle(count) {
  if (count === 0) return "text-gray-200"
  if (count <= 3) return "bg-gray-200 text-gray-500"
  if (count <= 6) return "bg-gray-400 text-white"
  return "bg-gray-700 text-white"
}

function Calendar({ mode, siteId, checkIn, checkOut, onSelectDate }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  const isPast = (d) =>
    new Date(year, month, d) <
    new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const prevMonth = () =>
    month === 0 ? (setYear((y) => y - 1), setMonth(11)) : setMonth((m) => m - 1)
  const nextMonth = () =>
    month === 11 ? (setYear((y) => y + 1), setMonth(0)) : setMonth((m) => m + 1)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />
          const past = isPast(d)
          const dateKey = toKey(year, month, d)

          // ── 전체 모드 ──
          if (mode === "all") {
            const isCheckIn = checkIn === dateKey
            const isCheckOut = checkOut === dateKey
            const inRange =
              checkIn && checkOut && dateKey > checkIn && dateKey < checkOut

            return (
              <button
                key={d}
                disabled={past}
                onClick={() => onSelectDate(dateKey)}
                className="flex justify-center py-0.5"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                    isCheckIn || isCheckOut
                      ? "bg-gray-700 text-white"
                      : inRange
                        ? "bg-gray-100 text-gray-700"
                        : past
                          ? "text-gray-200"
                          : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {d}
                </div>
              </button>
            )
          }

          // ── 사이트 모드 ──
          const avail = !past && (AVAILABILITY[siteId]?.[dateKey] ?? false)
          const isCheckIn = checkIn === dateKey
          const isCheckOut = checkOut === dateKey
          const inRange =
            checkIn && checkOut && dateKey > checkIn && dateKey < checkOut
          const disabled2 = past || !avail

          let circleStyle = ""
          let textStyle = ""
          if (isCheckIn || isCheckOut) {
            circleStyle = "bg-gray-700"
            textStyle = "text-white"
          } else if (inRange) {
            circleStyle = "bg-gray-100"
            textStyle = "text-gray-700"
          } else if (avail) {
            circleStyle = "hover:bg-gray-100"
            textStyle = "text-gray-700"
          } else {
            textStyle = past ? "text-gray-200" : "text-gray-300 line-through"
          }

          return (
            <button
              key={d}
              disabled={disabled2}
              onClick={() => onSelectDate(dateKey)}
              className="flex justify-center py-0.5"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${circleStyle} ${textStyle}`}
              >
                {d}
              </div>
            </button>
          )
        })}
      </div>

      {/* 범례 (사이트 모드만) */}
      {mode === "site" && (
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gray-700" />
            <span className="text-xs text-gray-400">예약 가능</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs line-through text-gray-300">15</span>
            <span className="text-xs text-gray-400">예약 불가</span>
          </div>
        </div>
      )}
    </div>
  )
}

function ReservationPage({ onBack }) {
  const [siteFilter, setSiteFilter] = useState(null) // null = 전체
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [step, setStep] = useState("checkin") // "checkin" | "checkout"
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
        // 같은 날 탭 → 취소
        resetDates()
      } else {
        setCheckIn(date)
        setCheckOut("")
        setStep("checkout")
      }
    } else {
      // checkout 단계
      if (date === checkOut) {
        // 같은 날 탭 → 체크아웃만 취소
        setCheckOut("")
      } else if (date < checkIn) {
        // 체크인보다 이전 → 스왑: 탭한 날짜 = 체크인, 기존 체크인 = 체크아웃
        setCheckIn(date)
        setCheckOut(checkIn)
        setStep("checkin")
      } else if (date === checkIn) {
        // 체크인과 같은 날 → 취소
        resetDates()
      } else {
        setCheckOut(date)
        setStep("checkin")
      }
    }
  }

  const handlePickSiteFromDate = (siteId) => {
    setSiteFilter(siteId)
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
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
    )
  }, [checkIn, checkOut])

  const totalPrice = useMemo(() => {
    if (!selectedSiteInfo || nights === 0) return null
    return (
      parseInt(selectedSiteInfo.price.replace(",", "")) * nights
    ).toLocaleString()
  }, [selectedSiteInfo, nights])

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 pb-28">
      {/* 헤더 */}
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm"
        >
          ←
        </button>
        <span className="text-base font-bold text-gray-700">예약하기</span>
      </header>

      {/* 사이트 필터 칩 */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-12 z-10">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {/* 전체 칩 */}
          <button
            onClick={handleAllChip}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              siteFilter === null
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-white text-gray-500 border-gray-300"
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
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {site.id}번
            </button>
          ))}
        </div>

        {/* 선택된 사이트 정보 */}
        {selectedSiteInfo && (
          <div className="mt-2 flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2">
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
      <section className="bg-white mt-2 px-4 py-4 border-b border-gray-100">
        {/* 사이트 모드: 체크인/아웃 표시 */}
        {siteFilter !== null && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => resetDates()}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-colors ${step === "checkin" && !checkIn ? "border-gray-600 bg-gray-50" : checkIn ? "border-gray-300 bg-white" : "border-gray-200"}`}
            >
              <p className="text-xs text-gray-400 mb-0.5">체크인</p>
              <p
                className={`text-sm font-semibold ${checkIn ? "text-gray-700" : "text-gray-300"}`}
              >
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
              className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-colors ${step === "checkout" ? "border-gray-600 bg-gray-50" : checkOut ? "border-gray-300 bg-white" : "border-gray-200"}`}
            >
              <p className="text-xs text-gray-400 mb-0.5">체크아웃</p>
              <p
                className={`text-sm font-semibold ${checkOut ? "text-gray-700" : "text-gray-300"}`}
              >
                {checkOut || "날짜 선택"}
              </p>
            </button>
          </div>
        )}

        {/* 전체 모드: 체크인/아웃 표시 + 안내 문구 */}
        {siteFilter === null && (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => resetDates()}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-colors ${step === "checkin" && !checkIn ? "border-gray-600 bg-gray-50" : checkIn ? "border-gray-300 bg-white" : "border-gray-200"}`}
              >
                <p className="text-xs text-gray-400 mb-0.5">체크인</p>
                <p
                  className={`text-sm font-semibold ${checkIn ? "text-gray-700" : "text-gray-300"}`}
                >
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
                className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-colors ${step === "checkout" ? "border-gray-600 bg-gray-50" : checkOut ? "border-gray-300 bg-white" : "border-gray-200"}`}
              >
                <p className="text-xs text-gray-400 mb-0.5">체크아웃</p>
                <p
                  className={`text-sm font-semibold ${checkOut ? "text-gray-700" : "text-gray-300"}`}
                >
                  {checkOut || "날짜 선택"}
                </p>
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">
              {step === "checkin"
                ? "체크인 날짜를 선택하세요"
                : "체크아웃 날짜를 선택하세요"}
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

      {/* 전체 모드 + 시작/끝 날짜 모두 선택 시: 바텀시트 */}
      {siteFilter === null && checkIn && checkOut && (
        <>
          {/* 딤 배경 */}
          <div
            className="fixed inset-0 bg-black/30 z-20"
            onClick={() => setCheckOut("")}
          />
          {/* 바텀시트 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white rounded-t-2xl z-30 px-4 pt-4 pb-8">
            {/* 핸들 */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h2 className="text-sm font-semibold text-gray-700 mb-0.5">
              {checkIn} → {checkOut}
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
                    onClick={() => handlePickSiteFromDate(site.id)}
                    className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-gray-500">
                          {site.id}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-700">
                          {site.name} · {site.type}
                        </p>
                        <p className="text-xs text-gray-400">{site.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-700">
                        {site.price}원
                      </p>
                      <p className="text-xs text-gray-400">/박</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 사이트 모드 + 날짜 선택 완료 시: 인원 + 예약자 정보 */}
      {siteFilter !== null && checkIn && checkOut && (
        <>
          <section className="bg-white mt-2 px-4 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              예약자 정보
            </h2>
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
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-white"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">연락처</p>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-white"
                />
              </div>
            </div>
          </section>

          {totalPrice && (
            <section className="bg-white mt-2 px-4 py-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                요금 안내
              </h2>
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
                    {checkIn} → {checkOut} ({nights}박)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {selectedSiteInfo?.price}원 × {nights}박
                  </span>
                  <span className="text-xs text-gray-700">{totalPrice}원</span>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    합계
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {totalPrice}원
                  </span>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-4 py-3">
        <button
          disabled={!siteFilter || !checkIn || !checkOut}
          className="w-full h-12 bg-gray-700 text-white rounded-2xl text-sm font-semibold disabled:opacity-30"
        >
          예약 확정하기
        </button>
      </div>
    </div>
  )
}

// 더미 예약 데이터
const DUMMY_RESERVATIONS = [
  {
    id: 1,
    name: "박동원",
    phone: "010-1234-5678",
    site: 3,
    type: "한가족존",
    checkIn: "2026-06-15",
    checkOut: "2026-06-17",
    nights: 2,
    price: "240,000",
    people: 4,
    status: "대기중",
    requestedAt: "2026-06-08 14:32",
  },
  {
    id: 2,
    name: "오스틴",
    phone: "010-9876-5432",
    site: 7,
    type: "한가족존",
    checkIn: "2026-06-15",
    checkOut: "2026-06-16",
    nights: 1,
    price: "120,000",
    people: 2,
    status: "대기중",
    requestedAt: "2026-06-08 11:05",
  },
  {
    id: 3,
    name: "신민재",
    phone: "010-5555-1234",
    site: 10,
    type: "두가족존",
    checkIn: "2026-06-15",
    checkOut: "2026-06-18",
    nights: 3,
    price: "720,000",
    people: 6,
    status: "확정",
    requestedAt: "2026-06-07 20:18",
  },
  {
    id: 4,
    name: "문보경",
    phone: "010-3333-7777",
    site: 1,
    type: "한가족존",
    checkIn: "2026-06-15",
    checkOut: "2026-06-17",
    nights: 2,
    price: "240,000",
    people: 3,
    status: "대기중",
    requestedAt: "2026-06-05 09:44",
  },
  {
    id: 5,
    name: "오지환",
    phone: "010-2222-8888",
    site: 5,
    type: "한가족존",
    checkIn: "2026-06-20",
    checkOut: "2026-06-21",
    nights: 1,
    price: "120,000",
    people: 2,
    status: "확정",
    requestedAt: "2026-06-04 16:30",
  },
  {
    id: 6,
    name: "문성주",
    phone: "010-4444-9999",
    site: 2,
    type: "한가족존",
    checkIn: "2026-06-20",
    checkOut: "2026-06-22",
    nights: 2,
    price: "240,000",
    people: 4,
    status: "대기중",
    requestedAt: "2026-06-03 13:22",
  },
  {
    id: 7,
    name: "박해민",
    phone: "010-6666-1111",
    site: 4,
    type: "한가족존",
    checkIn: "2026-06-22",
    checkOut: "2026-06-23",
    nights: 1,
    price: "120,000",
    people: 3,
    status: "확정",
    requestedAt: "2026-06-02 10:11",
  },
  {
    id: 8,
    name: "홍창기",
    phone: "010-7777-2222",
    site: 6,
    type: "한가족존",
    checkIn: "2026-06-22",
    checkOut: "2026-06-25",
    nights: 3,
    price: "360,000",
    people: 5,
    status: "대기중",
    requestedAt: "2026-06-01 18:44",
  },
  {
    id: 9,
    name: "문정빈",
    phone: "010-8888-3333",
    site: 9,
    type: "한가족존",
    checkIn: "2026-06-28",
    checkOut: "2026-06-29",
    nights: 1,
    price: "120,000",
    people: 2,
    status: "확정",
    requestedAt: "2026-05-30 09:00",
  },
  {
    id: 10,
    name: "임찬규",
    phone: "010-9999-4444",
    site: 8,
    type: "한가족존",
    checkIn: "2026-06-28",
    checkOut: "2026-06-30",
    nights: 2,
    price: "240,000",
    people: 4,
    status: "취소",
    requestedAt: "2026-05-29 14:20",
  },
  {
    id: 11,
    name: "이주헌",
    phone: "010-1111-5555",
    site: 2,
    type: "한가족존",
    checkIn: "2026-05-24",
    checkOut: "2026-05-25",
    nights: 1,
    price: "120,000",
    people: 2,
    status: "확정",
    requestedAt: "2026-03-20 10:00",
  },
  {
    id: 12,
    name: "함덕주",
    phone: "010-2222-6666",
    site: 5,
    type: "한가족존",
    checkIn: "2026-06-01",
    checkOut: "2026-06-03",
    nights: 2,
    price: "240,000",
    people: 4,
    status: "확정",
    requestedAt: "2026-04-28 15:30",
  },
  {
    id: 13,
    name: "이영빈",
    phone: "010-3333-7777",
    site: 8,
    type: "한가족존",
    checkIn: "2026-06-05",
    checkOut: "2026-06-06",
    nights: 1,
    price: "120,000",
    people: 3,
    status: "취소",
    requestedAt: "2025-06-01 09:00",
  },
]

const statusStyle = (status) => {
  if (status === "대기중") return "bg-gray-200 text-gray-600"
  if (status === "확정") return "bg-gray-700 text-white"
  return "bg-gray-100 text-gray-400"
}

function ReservationBottomSheet({
  r,
  onConfirm,
  onCancel,
  onRestore,
  onDelete,
  onClose,
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-20" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white rounded-t-2xl z-30 px-4 pt-4 pb-8">
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
              <span className="text-xs font-semibold text-gray-700">
                {value}
              </span>
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
              className="flex-1 h-11 bg-gray-700 text-white rounded-xl text-sm font-semibold"
            >
              입금 확인 · 확정
            </button>
          </div>
        )}
        {r.status === "확정" && (
          <button
            onClick={onCancel}
            className="w-full h-11 border border-gray-300 rounded-xl text-sm text-gray-500 font-semibold"
          >
            예약 취소
          </button>
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

const STATUS_FILTERS = ["대기중", "확정", "취소"]

function toDateInputStr(date) {
  return date.toISOString().split("T")[0]
}

// ── 건별보기 ──
function ListView({ reservations, search, onSearch, onSelect }) {
  const [activeFilters, setActiveFilters] = useState(["대기중", "확정", "취소"])

  const defaultEnd = new Date()
  const defaultStart = new Date()
  defaultStart.setMonth(defaultStart.getMonth() - 1)
  const [startDate, setStartDate] = useState(toDateInputStr(defaultStart))
  const [endDate, setEndDate] = useState(toDateInputStr(defaultEnd))
  const [allRange, setAllRange] = useState(false)
  const [sortBy, setSortBy] = useState("latest")

  const toggleFilter = (status) => {
    setActiveFilters((prev) =>
      prev.includes(status)
        ? prev.length === 1
          ? prev
          : prev.filter((s) => s !== status)
        : [...prev, status],
    )
  }

  const handleStartDate = (v) => {
    setStartDate(v)
    setAllRange(false)
  }
  const handleEndDate = (v) => {
    setEndDate(v)
    setAllRange(false)
  }
  const resetRange = () => {
    setStartDate(toDateInputStr(defaultStart))
    setEndDate(toDateInputStr(defaultEnd))
    setAllRange(false)
  }

  const filtered = [...reservations]
    .filter((r) => (search ? r.name.includes(search) : true))
    .filter((r) => activeFilters.includes(r.status))
    .filter(
      (r) =>
        allRange ||
        (r.requestedAt.slice(0, 10) >= startDate &&
          r.requestedAt.slice(0, 10) <= endDate),
    )
    .sort((a, b) => {
      if (sortBy === "latest")  return b.requestedAt.localeCompare(a.requestedAt)
      if (sortBy === "oldest")  return a.requestedAt.localeCompare(b.requestedAt)
      if (sortBy === "checkin") return a.checkIn.localeCompare(b.checkIn)
      return 0
    })

  return (
    <div>
      {/* 검색 */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="입금자 이름으로 검색"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="text-gray-400 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 날짜 범위 */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-600">
            신청일 기간
          </span>
          <div className="flex gap-1 ml-auto">
            <button
              onClick={resetRange}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                !allRange
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-400 border-gray-200"
              }`}
            >
              최근 한달
            </button>
            <button
              onClick={() => setAllRange(true)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                allRange
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-400 border-gray-200"
              }`}
            >
              전체
            </button>
          </div>
        </div>
        {!allRange && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDate(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 bg-white"
            />
            <span className="text-gray-300 text-xs shrink-0">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDate(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 bg-white"
            />
          </div>
        )}
      </div>

      {/* 상태 필터 */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => toggleFilter(status)}
            className={`flex-1 h-8 rounded-lg text-xs font-semibold border transition-colors ${
              activeFilters.includes(status)
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-white text-gray-400 border-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-400">총 {filtered.length}건</p>
          <div className="flex gap-1">
            {[
              { key: "latest",  label: "최신순" },
              { key: "oldest",  label: "예약빠른순" },
              { key: "checkin", label: "체크인순" },
            ].map(opt => (
              <button key={opt.key} onClick={() => setSortBy(opt.key)}
                className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                  sortBy === opt.key ? "bg-gray-700 text-white border-gray-700" : "bg-white text-gray-400 border-gray-200"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-xs text-gray-300 py-12">
            예약 내역이 없습니다
          </p>
        ) : (
          filtered.map((r) => (
            <ReservationRow key={r.id} r={r} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  )
}

// ── 캘린더보기 ──
function AdminCalendarView({ reservations, onSelect }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState("")

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  const prevMonth = () =>
    month === 0 ? (setYear((y) => y - 1), setMonth(11)) : setMonth((m) => m - 1)
  const nextMonth = () =>
    month === 11 ? (setYear((y) => y + 1), setMonth(0)) : setMonth((m) => m + 1)

  // 해당 날짜에 숙박 중인 예약 (checkIn <= date < checkOut, 취소 제외)
  const getActiveReservations = (dateKey) =>
    reservations.filter(
      (r) =>
        r.status !== "취소" && r.checkIn <= dateKey && r.checkOut > dateKey,
    )

  // 날짜별 사이트 예약 현황 (1~10)
  const getSiteMap = (dateKey) => {
    const active = getActiveReservations(dateKey)
    const map = {}
    active.forEach((r) => {
      map[r.site] = r
    })
    return map
  }

  const activeDateMap = selectedDate ? getSiteMap(selectedDate) : {}
  const activeCount = selectedDate
    ? getActiveReservations(selectedDate).length
    : 0

  return (
    <div>
      {/* 캘린더 */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg"
          >
            ‹
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {year}년 {month + 1}월
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((d, i) => {
            if (!d) return <div key={`e-${i}`} />
            const dateKey = toKey(year, month, d)
            const active = getActiveReservations(dateKey)
            const isSelected = selectedDate === dateKey
            const hasPending = active.some((r) => r.status === "대기중")
            const count = active.length

            return (
              <button
                key={d}
                onClick={() => setSelectedDate(isSelected ? "" : dateKey)}
                className={`flex flex-col items-center py-1.5 rounded-lg transition-colors ${isSelected ? "bg-gray-700" : "hover:bg-gray-50"}`}
              >
                <span
                  className={`text-xs mb-1 ${isSelected ? "text-white" : "text-gray-600"}`}
                >
                  {d}
                </span>
                {count > 0 ? (
                  <span
                    className={`text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      isSelected
                        ? "bg-white text-gray-700"
                        : hasPending
                          ? "bg-gray-300 text-gray-700"
                          : "bg-gray-600 text-white"
                    }`}
                  >
                    {count}
                  </span>
                ) : (
                  <span className="w-5 h-5" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gray-300" />
            <span className="text-xs text-gray-400">대기중 포함</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gray-600" />
            <span className="text-xs text-gray-400">전체 확정</span>
          </div>
        </div>
      </div>

      {/* 선택 날짜 전체 사이트 현황 */}
      {!selectedDate && (
        <p className="text-center text-xs text-gray-300 py-10">
          날짜를 선택하면 사이트 현황이 표시됩니다
        </p>
      )}

      {selectedDate && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">
              {selectedDate}
            </p>
            <span className="text-xs text-gray-400">
              {activeCount}곳 예약 중 · {10 - activeCount}곳 공실
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {SITE_LIST.map((site) => {
              const r = activeDateMap[site.id]
              const reserved = !!r
              return (
                <button
                  key={site.id}
                  onClick={() => reserved && onSelect(r.id)}
                  disabled={!reserved}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
                    reserved
                      ? "bg-white border-gray-200 cursor-pointer"
                      : "bg-gray-50 border-gray-100 cursor-default"
                  }`}
                >
                  {/* 동그라미 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                      reserved
                        ? r.status === "확정"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-300 text-gray-700"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {site.id}
                  </div>
                  {/* 정보 */}
                  {reserved ? (
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">
                          {r.name}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${statusStyle(r.status)}`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {r.checkIn} ~ {r.checkOut} · {r.nights}박
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-300">공실</span>
                  )}
                  {reserved && (
                    <span className="text-gray-300 text-sm shrink-0">›</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function AdminPage({ onBack }) {
  const [reservations, setReservations] = useState(DUMMY_RESERVATIONS)
  const [tab, setTab] = useState("건별") // "건별" | "캘린더"
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  const pendingCount = reservations.filter((r) => r.status === "대기중").length
  const selectedReservation = reservations.find((r) => r.id === selectedId)

  const handleConfirm = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "확정" } : r)),
    )
    setSelectedId(null)
  }
  const handleCancel = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "취소" } : r)),
    )
    setSelectedId(null)
  }
  const handleRestore = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "대기중" } : r)),
    )
    setSelectedId(null)
  }
  const handleDelete = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id))
    setSelectedId(null)
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 pb-8">
      {/* 헤더 */}
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={onBack}
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
      <div className="bg-white flex border-b border-gray-100">
        {["건별보기", "캘린더보기"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t === "건별보기" ? "건별" : "캘린더")
              setSearch("")
            }}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
              (t === "건별보기" ? tab === "건별" : tab === "캘린더")
                ? "border-gray-700 text-gray-700"
                : "border-transparent text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 뷰 */}
      {tab === "건별" ? (
        <ListView
          reservations={reservations}
          search={search}
          onSearch={setSearch}
          onSelect={setSelectedId}
        />
      ) : (
        <AdminCalendarView
          reservations={reservations}
          onSelect={setSelectedId}
        />
      )}

      {/* 상세 바텀시트 */}
      {selectedId && selectedReservation && (
        <ReservationBottomSheet
          r={selectedReservation}
          onConfirm={() => handleConfirm(selectedReservation.id)}
          onCancel={() => handleCancel(selectedReservation.id)}
          onRestore={() => handleRestore(selectedReservation.id)}
          onDelete={() => handleDelete(selectedReservation.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}

function ReservationRow({ r, onSelect }) {
  return (
    <button
      onClick={() => onSelect(r.id)}
      className="bg-white rounded-xl border border-gray-200 px-3 py-3 flex items-center gap-3 w-full text-left"
    >
      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-gray-600">{r.site}번</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{r.name}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${statusStyle(r.status)}`}
          >
            {r.status}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {r.checkIn} ~ {r.checkOut} · {r.nights}박 · {r.price}원
        </p>
      </div>
      <span className="text-gray-300 text-sm shrink-0">›</span>
    </button>
  )
}

function HomePage({ onReserve, onAdmin }) {
  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <span className="text-lg font-bold text-gray-700">캠핑오늘</span>
        <button
          onClick={onAdmin}
          className="text-xs text-gray-400 px-2 py-1 rounded-lg border border-gray-200"
        >
          관리자
        </button>
      </header>

      <div className="w-full h-56 bg-gray-300 flex items-center justify-center">
        <span className="text-gray-500 text-sm">대표 사진</span>
      </div>

      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">캠핑오늘</h1>
        <p className="text-sm text-gray-500 mt-1">
          강원도 홍천군 내면읍 ○○리 123-4
        </p>
        <div className="flex gap-2 mt-3">
          <div className="flex-1 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-500">전화 문의</span>
          </div>
          <button
            onClick={onReserve}
            className="flex-1 h-9 bg-gray-600 rounded-lg flex items-center justify-center"
          >
            <span className="text-xs text-white font-semibold">예약하기</span>
          </button>
        </div>
      </div>

      <div className="bg-white mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">운영 정보</h2>
        <div className="flex flex-col gap-2">
          {[
            ["체크인", "14:00"],
            ["체크아웃", "11:00"],
            ["운영기간", "연중 운영"],
            ["반려동물", "가능 (소형견)"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-xs text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-white mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          사이트 안내
        </h2>
        <div className="flex flex-col gap-2">
          {SITE_LIST.map((site) => (
            <div
              key={site.id}
              className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-3"
            >
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-500">
                    {site.id}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {site.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{site.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-700">
                  {site.price}원
                </p>
                <p className="text-xs text-gray-400">/ 1박</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">편의시설</h2>
        <div className="grid grid-cols-3 gap-2">
          {facilities.map((f) => (
            <div
              key={f}
              className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 rounded-xl"
            >
              <div className="w-7 h-7 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-500">{f}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">사진</h2>
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
          ))}
        </div>
      </section>

      <section className="bg-white mt-2 px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-700">리뷰</h2>
          <span className="text-xs text-gray-400">전체보기</span>
        </div>
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  {r.name}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${i < r.rating ? "bg-gray-500" : "bg-gray-200"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-4 py-3">
        <button
          onClick={onReserve}
          className="w-full h-12 bg-gray-700 text-white rounded-2xl text-sm font-semibold"
        >
          예약하기
        </button>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState("home")
  if (page === "reservation")
    return <ReservationPage onBack={() => setPage("home")} />
  if (page === "admin") return <AdminPage onBack={() => setPage("home")} />
  return (
    <HomePage
      onReserve={() => setPage("reservation")}
      onAdmin={() => setPage("admin")}
    />
  )
}

export default App
