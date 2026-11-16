import { Outlet } from 'react-router-dom';
import CustomerHeader from '../components/customer/CustomerHeader';
import { FooterBottom } from '../components/public/Footer';

const CustomerLayout = () => {
  return (
    <div className="customer-site">
      <CustomerHeader />
      <main className="customer-main">
        <Outlet />
      </main>
      <FooterBottom />
    </div>
  );
};

export default CustomerLayout;