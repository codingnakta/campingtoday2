import { useState, useEffect } from "react"

const STORAGE_KEY = "campingtoday_notices"

const DEFAULTS = [
  {
    id: 1,
    title: "7월 성수기 예약이 시작되었습니다.",
    content: "7월 성수기 예약을 시작합니다. 원하시는 날짜를 빠르게 선택해 주세요.\n많은 이용 부탁드립니다.",
    createdAt: "2026-06-20",
    pinned: true,
  },
  {
    id: 2,
    title: "캠핑장 이용 안내",
    content: "체크인 14:00 / 체크아웃 12:00\n반려동물 동반은 불가합니다.\n취사는 지정 구역에서만 가능합니다.",
    createdAt: "2026-06-15",
    pinned: false,
  },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function save(notices) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices))
}

export function useNotices() {
  const [notices, setNotices] = useState(load)

  useEffect(() => {
    save(notices)
  }, [notices])

  const add = ({ title, content, pinned = false }) => {
    const next = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toISOString().slice(0, 10),
      pinned,
    }
    setNotices((prev) => [next, ...prev])
    return next.id
  }

  const remove = (id) => {
    setNotices((prev) => prev.filter((n) => n.id !== id))
  }

  const sorted = [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.id - a.id
  })

  return { notices: sorted, add, remove }
}
