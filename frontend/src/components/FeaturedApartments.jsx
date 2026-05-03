import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ApartmentCard from './ApartmentCard';

export default function FeaturedApartments() {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    api.get('/api/apartments?is_hot=1&limit=4')
      .then(r => setApartments(r.data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="section-title !text-left !mb-0">CĂN HỘ NỔI BẬT</h2>
          <Link to="/chung-cu-ha-noi" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            Xem tất cả
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="w-12 h-1 bg-accent mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {apartments.map(apt => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))}
        </div>
      </div>
    </section>
  );
}
