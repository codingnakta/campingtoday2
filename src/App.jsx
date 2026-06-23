import { HashRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ReservationPage from "./pages/ReservationPage"
import AdminPage from "./pages/AdminPage"
import MyReservationPage from "./pages/MyReservationPage"
import OperatorPage from "./pages/OperatorPage"
import OperatorReservationsPage from "./pages/operator/OperatorReservationsPage"
import OperatorCancelPage from "./pages/operator/OperatorCancelPage"
import OperatorTodayPage from "./pages/operator/OperatorTodayPage"
import OperatorNewReservationPage from "./pages/operator/OperatorNewReservationPage"
import OperatorSitesPage from "./pages/operator/OperatorSitesPage"
import OperatorPricingPage from "./pages/operator/OperatorPricingPage"
import OperatorPhotosPage from "./pages/operator/OperatorPhotosPage"
import OperatorHolidaysPage from "./pages/operator/OperatorHolidaysPage"
import NoticesPage from "./pages/NoticesPage"
import NoticeDetailPage from "./pages/NoticeDetailPage"
import OperatorNoticesPage from "./pages/operator/OperatorNoticesPage"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/my-reservation" element={<MyReservationPage />} />
        <Route path="/operator" element={<OperatorPage />} />
        <Route path="/operator/reservations" element={<OperatorReservationsPage />} />
        <Route path="/operator/cancel" element={<OperatorCancelPage />} />
        <Route path="/operator/today" element={<OperatorTodayPage />} />
        <Route path="/operator/new-reservation" element={<OperatorNewReservationPage />} />
        <Route path="/operator/sites" element={<OperatorSitesPage />} />
        <Route path="/operator/pricing" element={<OperatorPricingPage />} />
        <Route path="/operator/photos" element={<OperatorPhotosPage />} />
        <Route path="/operator/holidays" element={<OperatorHolidaysPage />} />
        <Route path="/operator/notices" element={<OperatorNoticesPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/notices/:id" element={<NoticeDetailPage />} />
      </Routes>
    </HashRouter>
  )
}

