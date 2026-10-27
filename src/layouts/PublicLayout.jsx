import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

const PublicLayout = () => {
  return (
    <div className="public-layout flex-col min-h-screen">
      <Navbar />
      <main className="public-main flex-grow">
        {/* Outlet akan me-render komponen halaman yang sedang aktif */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;