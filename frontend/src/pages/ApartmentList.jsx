import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import ApartmentCard from '../components/ApartmentCard';
import CTABar from '../components/CTABar';

const PRICE_RANGES = [
  { label: 'Tất cả giá', value: '' },
  { label: 'Dưới 2 tỷ', value: 'duoi-2-ty', min: 0, max: 2e9 },
  { label: '2 – 3 tỷ', value: '2-3-ty', min: 2e9, max: 3e9 },
  { label: '3 – 4 tỷ', value: '3-4-ty', min: 3e9, max: 4e9 },
  { label: 'Trên 4 tỷ', value: 'tren-4-ty', min: 4e9, max: Infinity },
];

export default function ApartmentList({ area, title }) {
  const [searchParams] = useSearchParams();
  const bedroomsParam = searchParams.get('bedrooms');
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBed, setFilterBed] = useState(bedroomsParam || '');
  const [filterPrice, setFilterPrice] = useState('');

  useEffect(() => {
    const params = {};
    if (area) params.area = area;
    setLoading(true);
    api.get('/api/apartments', { params })
      .then(r => { setAll(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [area]);

  const filtered = all.filter(a => {
    if (filterBed && String(a.bedrooms) !== String(filterBed)) return false;
    if (filterPrice) {
      const range = PRICE_RANGES.find(r => r.value === filterPrice);
      if (range && (a.price < range.min || a.price >= range.max)) return false;
    }
    return true;
  });

  const pageTitle = title || 'Chung Cư Hà Nội';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero banner */}
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-white font-extrabold text-3xl md:text-4xl mb-2">{pageTitle.toUpperCase()}</h1>
          <p className="text-white/80 text-sm">Giá thật – Sổ đỏ – Hỗ trợ vay ngân hàng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-gray-600">Lọc:</span>
          <select
            value={filterBed}
            onChange={e => setFilterBed(e.target.value)}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-primary">
            <option value="">Tất cả phòng ngủ</option>
            <option value="1">1 phòng ngủ</option>
            <option value="2">2 phòng ngủ</option>
            <option value="3">3 phòng ngủ</option>
          </select>
          <select
            value={filterPrice}
            onChange={e => setFilterPrice(e.target.value)}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-primary">
            {PRICE_RANGES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <span className="text-gray-400 text-sm ml-auto">{filtered.length} căn</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-semibold mb-2">Không tìm thấy căn hộ phù hợp</p>
            <p className="text-sm">Vui lòng thay đổi bộ lọc</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(apt => (
              <ApartmentCard key={apt.id} apt={apt} />
            ))}
          </div>
        )}
      </div>

      <CTABar />
      <Footer />
      <FloatingButtons />
    </div>
  );
}
