import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import ApartmentCard from '../components/ApartmentCard';
import CTABar from '../components/CTABar';
import { useRefreshSignal } from '../contexts/RefreshContext';

const PRICE_RANGES = [
  { label: 'Tất cả giá', value: '' },
  { label: 'Dưới 2 tỷ', value: 'duoi-2-ty', min: 0, max: 2e9 },
  { label: '2 – 3 tỷ', value: '2-3-ty', min: 2e9, max: 3e9 },
  { label: '3 – 4 tỷ', value: '3-4-ty', min: 3e9, max: 4e9 },
  { label: 'Trên 4 tỷ', value: 'tren-4-ty', min: 4e9, max: Infinity },
];

const RENT_RANGES = [
  { label: 'Tất cả giá', value: '' },
  { label: 'Dưới 8 triệu', value: 'duoi-8tr', min: 0, max: 8e6 },
  { label: '8 – 12 triệu', value: '8-12tr', min: 8e6, max: 12e6 },
  { label: 'Trên 12 triệu', value: 'tren-12tr', min: 12e6, max: Infinity },
];

export default function ApartmentList({ listingType: listingTypeProp, title: titleProp }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchQ = searchParams.get('q') || '';
  const bedroomsParam = searchParams.get('bedrooms') || '';
  const refresh = useRefreshSignal();

  const isSearch = location.pathname === '/tim-kiem';
  const isRent = listingTypeProp === 'thue';
  const priceRanges = isRent ? RENT_RANGES : PRICE_RANGES;

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBed, setFilterBed] = useState(bedroomsParam);
  const [filterPrice, setFilterPrice] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (listingTypeProp) params.listing_type = listingTypeProp;
    if (searchQ) params.search = searchQ;
    api.get('/api/apartments', { params })
      .then(r => setAll(r.data))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, [listingTypeProp, searchQ, refresh]);

  const filtered = all.filter(a => {
    if (filterBed && String(a.bedrooms) !== String(filterBed)) return false;
    if (filterPrice) {
      const range = priceRanges.find(r => r.value === filterPrice);
      if (range && (a.price < range.min || a.price >= range.max)) return false;
    }
    return true;
  });

  let pageTitle = titleProp || (isRent ? 'Cho Thuê Căn Hộ Hà Nội' : 'Chung Cư Hà Nội');
  if (isSearch && searchQ) pageTitle = `Kết quả: "${searchQ}"`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero banner */}
      <div className={`py-8 sm:py-10 ${isRent ? 'bg-green-700' : 'bg-primary'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl mb-1 leading-tight">
            {pageTitle.toUpperCase()}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm">
            {isRent ? 'Căn hộ cho thuê uy tín – Giá tốt – Vào ở ngay'
              : isSearch ? 'Tìm thấy các tin đăng phù hợp'
              : 'Giá thật – Sổ đỏ – Hỗ trợ vay ngân hàng'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Lọc:</span>
          <select
            value={filterBed}
            onChange={e => setFilterBed(e.target.value)}
            className="border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-primary">
            <option value="">Tất cả phòng ngủ</option>
            <option value="1">1 phòng ngủ</option>
            <option value="2">2 phòng ngủ</option>
            <option value="3">3 phòng ngủ</option>
          </select>
          <select
            value={filterPrice}
            onChange={e => setFilterPrice(e.target.value)}
            className="border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-primary">
            {priceRanges.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {(filterBed || filterPrice) && (
            <button
              onClick={() => { setFilterBed(''); setFilterPrice(''); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium">
              Xóa lọc
            </button>
          )}
          <span className="text-gray-400 text-xs ml-auto font-medium">{filtered.length} căn</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-gray-500 mb-1">Không tìm thấy căn hộ phù hợp</p>
            <p className="text-sm">Vui lòng thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
