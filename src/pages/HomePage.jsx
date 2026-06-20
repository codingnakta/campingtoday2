import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { facilities, reviews } from "../data/sites"
import main1 from "../assets/main1.jpg"
import main2 from "../assets/main2.jpg"
import main3 from "../assets/main3.jpg"
import main4 from "../assets/main4.jpg"
import main5 from "../assets/main5.jpg"
import main6 from "../assets/main6.jpg"
import iconShower from "../assets/샤워기.png"
import iconToilet from "../assets/화장실.png"
import iconSink from "../assets/개수대.png"
import iconElectric from "../assets/전기.png"
import iconWifi from "../assets/와이파이.png"
import iconShop from "../assets/매점.png"

const FACILITY_ICONS = {
  샤워실: iconShower,
  화장실: iconToilet,
  개수대: iconSink,
  전기콘센트: iconElectric,
  무선인터넷: iconWifi,
  매점: iconShop,
}

const HERO_IMAGES = [main1, main2, main3, main4, main5, main6]

const SITE_ZONES = [
  {
    id: "single",
    category: "오토캠핑",
    name: "계곡 한가족존",
    desc: "법흥계곡을 마주 보는 계곡촌입니다",
    price: "60,000",
    minNight: 1,
    adults: 2,
    children: 2,
    ground: "파쇄석",
    size: "5.5 × 10m",
    photo: main1,
  },
  {
    id: "double",
    category: "오토캠핑",
    name: "계곡 두가족존",
    desc: "두가족이 함께 할 수 있는 사이트",
    price: "120,000",
    minNight: 1,
    adults: 4,
    children: 4,
    ground: "파쇄석",
    size: "12 × 8m",
    photo: main2,
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)
  const touchStartX = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
    }
    const onTouchMove = (e) => {
      if (touchStartX.current === null) return
      if (Math.abs(touchStartX.current - e.touches[0].clientX) > 10)
        e.preventDefault()
    }
    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return
      const diff = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) >= 30) {
        setCurrentIndex((prev) =>
          diff > 0
            ? (prev + 1) % HERO_IMAGES.length
            : (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length,
        )
      }
      touchStartX.current = null
    }

    const onMouseDown = (e) => {
      touchStartX.current = e.clientX
    }
    const onMouseUp = (e) => {
      if (touchStartX.current === null) return
      const diff = touchStartX.current - e.clientX
      if (Math.abs(diff) >= 30) {
        setCurrentIndex((prev) =>
          diff > 0
            ? (prev + 1) % HERO_IMAGES.length
            : (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length,
        )
      }
      touchStartX.current = null
    }
    const onMouseLeave = () => {
      touchStartX.current = null
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd, { passive: true })
    el.addEventListener("mousedown", onMouseDown)
    el.addEventListener("mouseup", onMouseUp)
    el.addEventListener("mouseleave", onMouseLeave)

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
      el.removeEventListener("mousedown", onMouseDown)
      el.removeEventListener("mouseup", onMouseUp)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-page pb-20">
      <header className="bg-surface px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <span className="text-lg font-bold text-gray-700">캠핑오늘</span>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin")}
            className="text-xs text-gray-500 px-2 py-1 rounded-lg border border-gray-300"
          >
            운영
          </button>
          <button
            onClick={() => navigate("/my-reservation")}
            className="text-xs text-white bg-primary px-2 py-1 rounded-lg"
          >
            예약확인
          </button>
        </div>
      </header>

      <div
        ref={carouselRef}
        className="relative w-full h-56 overflow-hidden bg-gray-300"
      >
        {HERO_IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`캠핑오늘 ${i + 1}`}
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 select-none ${i === currentIndex ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-surface px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">캠핑오늘</h1>
        <p className="text-sm text-gray-500 mt-1">
          강원특별자치도 영월군 무릉도원면 무릉법흥로 1088
        </p>

        <div className="flex gap-2 mt-3">
          <a
            href="tel:010-4200-1088"
            className="border border-gray-200 flex-1 h-9 bg-white rounded-lg flex items-center justify-center"
          >
            <span className="text-xs text-gray-500">전화 문의</span>
          </a>
          <button
            onClick={() => navigate("/reservation")}
            className="flex-1 h-9 bg-primary rounded-lg flex items-center justify-center"
          >
            <span className="text-xs text-white font-semibold">예약하기</span>
          </button>
        </div>
      </div>

      <div className="bg-surface mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">운영 정보</h2>
        <div className="flex flex-col gap-2">
          {[
            ["체크인", "14:00"],
            ["체크아웃", "12:00"],
            ["운영기간", "봄, 여름, 가을"],
            ["반려동물", "불가"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-xs text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-surface mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          사이트 안내
        </h2>
        <div className="flex flex-col gap-3">
          {SITE_ZONES.map((zone) => (
            <div
              key={zone.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="flex">
                <img
                  src={zone.photo}
                  alt={zone.name}
                  className="w-36 h-36 object-cover shrink-0"
                />
                <div className="flex flex-col justify-center px-3 py-3 gap-0.5">
                  <span className="text-xs text-gray-400">{zone.category}</span>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">
                    {zone.name}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {zone.desc}
                  </p>
                  <p className="text-sm font-bold text-gray-800 mt-1.5">
                    {zone.price}원
                    <span className="text-xs font-normal text-gray-400">
                      {" "}
                      ~/1박
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    체크인 14:00 · 체크아웃 12:00
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 px-3 py-2.5 flex gap-3 flex-wrap">
                <span className="text-xxs text-gray-500">
                  최소 {zone.minNight}박
                </span>
                <span className="text-xxs text-gray-500">
                  성인 {zone.adults}인, 미성년 {zone.children}인
                </span>
                <span className="text-xxs text-gray-500">{zone.ground}</span>
                <span className="text-xxs text-gray-500">{zone.size}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">편의시설</h2>
        <div className="grid grid-cols-3 gap-2">
          {facilities.map((f) => (
            <div
              key={f}
              className="flex flex-col items-center gap-1.5 py-3 bg-page rounded-xl"
            >
              <img
                src={FACILITY_ICONS[f]}
                alt={f}
                className="w-7 h-7 object-contain"
              />
              <span className="text-xs text-gray-500">{f}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface mt-2 px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">사진</h2>
        <div className="grid grid-cols-3 gap-1.5">
          {HERO_IMAGES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`캠핑오늘 ${i + 1}`}
              className="aspect-square w-full object-cover rounded-lg"
            />
          ))}
        </div>
      </section>

      <section className="bg-surface mt-2 px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-700">리뷰</h2>
          <span className="text-xs text-gray-400">전체보기</span>
        </div>
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-100 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  {r.name}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < r.rating ? "text-primary" : "text-gray-200"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-surface">
        <div className="max-w-sm mx-auto px-4 py-3">
          <button
            onClick={() => navigate("/reservation")}
            className="w-full h-12 bg-primary text-white rounded-xl text-sm font-semibold"
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  )
}
