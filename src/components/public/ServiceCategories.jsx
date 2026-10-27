import React from 'react';
import { Scissors, Home, Stethoscope, Syringe } from 'lucide-react';

const categories = [
  { id: 1, title: 'Pet Grooming', desc: 'Menjaga kebersihan dan penampilan si kecil.', icon: <Scissors size={40} strokeWidth={1.5} /> },
  { id: 2, title: 'Penitipan & Daycare', desc: 'Tempat aman saat Anda tidak bisa menemani.', icon: <Home size={40} strokeWidth={1.5} /> },
  { id: 3, title: 'Klinik Hewan', desc: 'Pemeriksaan dan perawatan medis profesional.', icon: <Stethoscope size={40} strokeWidth={1.5} /> },
  { id: 4, title: 'Vaksinasi', desc: 'Melindungi mereka dari berbagai penyakit.', icon: <Syringe size={40} strokeWidth={1.5} /> }
];

const ServiceCategories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-[#321B16] mb-4">Semua yang mereka butuhkan, ada di sini</h2>
          <p className="text-gray-600">Kami menghadirkan berbagai layanan terbaik untuk menjaga kesehatan dan kebahagiaan hewan kesayangan Anda.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="p-8 rounded-3xl bg-[#F6F1E9] border border-[#E5D6C3] text-center hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              {/* Tambahkan flex dan warna Muted Caramel untuk ikon */}
              <div className="mb-4 flex justify-center text-[#9B7A48]">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-[#321B16] mb-2">{cat.title}</h3>
              <p className="text-sm text-gray-600">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;