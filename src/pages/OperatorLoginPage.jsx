import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../assets/back.png"

const CORRECT_PIN = "0000"

export default function OperatorLoginPage() {
  const navigate = useNavigate()
  const [pin, setPin] = useState("")
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        navigate("/admin")
      } else {
        setShake(true)
        setTimeout(() => {
          setPin("")
          setShake(false)
        }, 600)
      }
    }
  }, [pin, navigate])

  const handleKey = (key) => {
    if (key === "del") {
      setPin((p) => p.slice(0, -1))
    } else if (pin.length < 4) {
      setPin((p) => p + key)
    }
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"]

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <header className="px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10">
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-bold text-gray-800">운영자 로그인</p>
          <p className="text-sm text-gray-400">PIN 4자리를 입력해 주세요</p>
        </div>

        <div className={`flex gap-4 ${shake ? "animate-shake" : ""}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-colors duration-150 ${
                i < pin.length
                  ? "bg-primary border-primary"
                  : "bg-transparent border-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {keys.map((key, i) => {
            if (key === "") return <div key={i} />
            if (key === "del") {
              return (
                <button
                  key={i}
                  onClick={() => handleKey("del")}
                  className="h-14 rounded-2xl flex items-center justify-center text-gray-500 text-lg active:bg-gray-100 transition-colors"
                >
                  ⌫
                </button>
              )
            }
            return (
              <button
                key={i}
                onClick={() => handleKey(key)}
                className="h-14 bg-surface rounded-2xl flex items-center justify-center text-lg font-semibold text-gray-700 border border-gray-100 active:bg-gray-100 transition-colors shadow-sm"
              >
                {key}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
