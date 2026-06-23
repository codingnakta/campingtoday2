import { useNavigate } from "react-router-dom"
import iconBack from "../assets/back.png"
import profile from "../assets/profile.png"
import calender from "../assets/calender.svg"
import cancle from "../assets/cancle.svg"
import headphone from "../assets/headphone.svg"

export default function OperatorPage() {
  const navigate = useNavigate()

  const menus = [
    { label: "예약현황", icon: calender, action: () => navigate("/operator/reservations") },
    { label: "취소요청", icon: cancle, action: () => navigate("/operator/cancel") },
    {
      label: "고객센터",
      icon: headphone,
      iconSize: "w-8 h-8",
      action: () => {
        window.location.href = "tel:01077762703"
      },
    },
  ]

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <img src={iconBack} alt="뒤로" className="w-4 h-4 object-contain" />
        </button>
        <span className="text-base font-bold text-gray-700">운영</span>
      </header>
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="w-[100px] h-[100px] bg-white my-2 rounded-4xl flex items-center justify-center overflow-hidden">
          <img
            src={profile}
            alt="프로필"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-2xl font-bold text-gray-700 mt-5">
          안녕하세요, 윤광희사장님
        </div>
        <div className="w-[90%] bg-primary mt-10 rounded-3xl flex items-center">
          {menus.map(({ label, icon, action, iconSize }, i) => (
            <div key={label} className="flex-1 flex items-center">
              <button
                onClick={action}
                className="flex-1 py-5 flex flex-col items-center justify-center text-white text-sm gap-2"
              >
                <img
                  src={icon}
                  alt={label}
                  className={`${iconSize ?? "w-6 h-6"} brightness-0 invert`}
                />
                {label}
              </button>
              {i < 2 && <div className="w-px h-8 bg-white/30" />}
            </div>
          ))}
        </div>
        <div className="w-[90%] mt-10 rounded-3xl flex flex-col pb-6">
          <div className="py-4 px-6 text-gray-400 text-xs divide-y divide-gray-200 rounded-3xl bg-white">
            예약
            {[
              { label: "전체 예약", path: "/operator/reservations" },
              { label: "취소 요청", path: "/operator/cancel" },
              { label: "오늘 입실/퇴실 목록", path: "/operator/today" },
              { label: "직접 예약 등록", path: "/operator/new-reservation" },
            ].map(({ label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                className="py-3 flex items-center justify-between text-black text-base cursor-pointer"
              >
                {label}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          <div className="py-4 px-6 text-gray-400 text-xs divide-y divide-gray-200 rounded-3xl bg-white mt-4">
            캠핑장 운영/관리
            {[
              { label: "사이트 관리", path: "/operator/sites" },
              { label: "요금 설정", path: "/operator/pricing" },
              { label: "사진 관리", path: "/operator/photos" },
              { label: "휴무일 설정", path: "/operator/holidays" },
              { label: "공지사항 관리", path: "/operator/notices" },
            ].map(({ label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                className="py-3 flex items-center justify-between text-black text-base cursor-pointer"
              >
                {label}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
