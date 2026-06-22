import { HashRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ReservationPage from "./pages/ReservationPage"
import AdminPage from "./pages/AdminPage"
import MyReservationPage from "./pages/MyReservationPage"
import OperatorPage from "./pages/OperatorPage"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservation" element={<ReservationPage />} />
<Route path="/admin" element={<AdminPage />} />
        <Route path="/my-reservation" element={<MyReservationPage />} />
        <Route path="/operator" element={<OperatorPage />} />
      </Routes>
    </HashRouter>
  )
}

