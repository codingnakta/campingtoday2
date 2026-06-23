import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import iconBack from "../../assets/back.png"

export default function OperatorPhotosPage() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])
  const inputRef = useRef()

  const handleAdd = (e) => {
    const files = Array.from(e.target.files)
    const urls = files.map((f) => URL.createObjectURL(f))
    setPhotos((prev) => [...prev, ...urls])
  }

  const handleDelete = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
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
        <span className="text-base font-bold text-gray-700">사진 관리</span>
      </header>

      <div className="px-4 py-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleAdd}
        />

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => inputRef.current.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">추가</span>
          </button>

          {photos.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <p className="text-center text-sm text-gray-300 mt-16">
            + 버튼을 눌러 사진을 추가하세요
          </p>
        )}
      </div>
    </div>
  )
}
