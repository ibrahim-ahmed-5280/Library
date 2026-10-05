import Recovery from '../features/auth/pages/RecoveryPage'
import LibrarySettings from '../features/settings/pages/LibrarySettingsPage'
import EmailOutbox from '../features/email/pages/EmailPage'
import ContactMessages from '../features/contact/pages/ContactMessagesPage'
import PublicLayout from './layouts/PublicLayout'
import StaffLayout from './layouts/StaffLayout'
import Protected from '../features/auth/components/ProtectedRoute'
import { Link, Route, Routes } from 'react-router-dom'
import Home from '../features/home/pages/HomePage'
import About from '../features/about/pages/AboutPage'
import Help from '../features/help/pages/HelpPage'
import Faq from '../features/faq/pages/FaqPage'
import Catalog from '../features/catalog/pages/CatalogPage'
import { BookDetails } from '../features/catalog/pages/BookDetailsPage'
import Login from '../features/auth/pages/LoginPage'
import Account from '../features/account/pages/AccountPage'
import Profile from '../features/account/pages/ProfilePage'
import Dashboard from '../features/dashboard/pages/DashboardPage'
import Inventory from '../features/inventory/pages/InventoryPage'
import Members from '../features/members/pages/MembersPage'
import Circulation from '../features/circulation/pages/CirculationPage'
import Reservations from '../features/reservations/pages/ReservationsPage'
import Reports from '../features/reports/pages/ReportsPage'
import AuditLog from '../features/audit/pages/AuditPage'
import Policies from '../features/policies/pages/PoliciesPage'

function NotFound() {
  return (
    <div className="container page">
      <h1>Page not found</h1>
      <p className="muted">This address does not match a library page.</p>
      <Link className="button" to="/">
        Go home
      </Link>
    </div>
  )
}
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="faq" element={<Faq />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="book/:bookId" element={<BookDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Login />} />
        <Route path="forgot-password" element={<Recovery />} />
        <Route path="reset-password" element={<Recovery />} />
        <Route path="verify-email" element={<Recovery />} />
        <Route element={<Protected />}>
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<Protected staff />}>
        <Route path="staff" element={<StaffLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="members" element={<Members />} />
          <Route path="team" element={<Members team />} />
          <Route path="profile" element={<Profile />} />
          <Route path="circulation" element={<Circulation />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="contact" element={<ContactMessages />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="policies" element={<Policies />} />
          <Route path="settings" element={<LibrarySettings />} />
          <Route path="email" element={<EmailOutbox />} />
        </Route>
      </Route>
    </Routes>
  )
}
