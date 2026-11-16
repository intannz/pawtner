import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { FooterBottom } from '../components/public/Footer';

const AdminLayout = () => {
  return (
    <div className="admin-layout flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="admin-wrapper flex-grow flex flex-col ml-64">
        <AdminHeader />
        <main className="admin-main p-8">
          <div className="admin-content-container max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <FooterBottom />
      </div>
    </div>
  );
};

export default AdminLayout;