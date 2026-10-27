import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import ServicesPage from '../pages/public/ServicesPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import AboutPage from '../pages/public/AboutPage';
import FAQPage from '../pages/public/FAQPage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Customer Pages
import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage';
import MyPetsPage from '../pages/customer/MyPetsPage';
import MyBookingsPage from '../pages/customer/MyBookingsPage';
import CareHistoryPage from '../pages/customer/CareHistoryPage';
import ProfilePage from '../pages/customer/ProfilePage';
import PetDetailPage from '../pages/customer/PetDetailPage';
import BookingDetailPage from '../pages/customer/BookingDetailPage';
import BookingFormPage from '../pages/customer/BookingFormPage';
import NotificationsPage from '../pages/customer/NotificationsPage';

// Admin Pages (Menggunakan alias untuk nama file yang serupa)
import AdminDashboardPage from '../pages/admin/DashboardPage';
import AdminBookingsPage from '../pages/admin/BookingsPage';
import AdminBookingDetailPage from '../pages/admin/BookingDetailPage';
import CustomersPage from '../pages/admin/CustomersPage';
import CustomerDetailPage from '../pages/admin/CustomerDetailPage';
import PetsPage from '../pages/admin/PetsPage';
import AdminServicesPage from '../pages/admin/ServicesPage';
import CRMOverviewPage from '../pages/admin/crm/CRMOverviewPage';
import SegmentsPage from '../pages/admin/crm/SegmentsPage';
import FollowUpsPage from '../pages/admin/crm/FollowUpsPage';
import LoyaltyPage from '../pages/admin/crm/LoyaltyPage';
import TransactionsPage from '../pages/admin/TransactionsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import StaffPage from '../pages/admin/StaffPage';
import SettingsPage from '../pages/admin/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* 2. AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* 3. CUSTOMER PORTAL ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route element={<CustomerLayout />}>
          <Route path="/account" element={<CustomerDashboardPage />} />
          <Route path="/account/pets" element={<MyPetsPage />} />
          <Route path="/account/pets/:id" element={<PetDetailPage />} />
          <Route path="/account/bookings" element={<MyBookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/account/booking/new" element={<BookingFormPage />} />
          <Route path="/account/history" element={<CareHistoryPage />} />
          <Route path="/account/notifications" element={<NotificationsPage />} />
          <Route path="/account/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 4. ADMIN PANEL ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/bookings/:id" element={<AdminBookingDetailPage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/admin/crm/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/admin/pets" element={<PetsPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          
          {/* Admin CRM Routes */}
          <Route path="/admin/crm" element={<CRMOverviewPage />} />
          <Route path="/admin/crm/segments" element={<SegmentsPage />} />
          <Route path="/admin/crm/follow-ups" element={<FollowUpsPage />} />
          <Route path="/admin/crm/loyalty" element={<LoyaltyPage />} />
          
          <Route path="/admin/transactions" element={<TransactionsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/staff" element={<StaffPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};