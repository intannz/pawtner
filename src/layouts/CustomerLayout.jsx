import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../components/customer/CustomerSidebar';
import CustomerHeader from '../components/customer/CustomerHeader';

const CustomerLayout = () => {
  return (
    <div className="portal-layout flex min-h-screen bg-warm-beige bg-opacity-30">
      <CustomerSidebar />
      <div className="portal-wrapper flex-grow flex flex-col ml-64">
        <CustomerHeader title="Customer Portal" />
        <main className="portal-main p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;