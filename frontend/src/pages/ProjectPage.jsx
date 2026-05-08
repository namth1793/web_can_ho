import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
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

export default function ProjectPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const listingType = searchParams.get('loai') || 'ban';

  const [project, setProject] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBed, setFilterBed] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

  useEffect(() => {
    setLoading(true);
    setFilterBed('');
    setFilterPrice('');
    Promise.all([
      api.get(`/api/projects/${slug}`),
      api.get('/api/apartments', {
        params: {
          parent_slug: slug,
          listing_type: listingType,
        }
      })
    ]).then(([projRes, aptRes]) => {
      setProject(projRes.data);
      // If no apartments via parent_slug, try project_slug directly
      if (aptRes.data.length === 0) {
        return api.get('/api/apartments', {
          params: { project_slug: slug, listing_type: listingType }
        }).then(r => setApartments(r.data));
      }
      setApartments(aptRes.data);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, [slug, listingType]);

  const filtered = apartments.filter(a => {
    if (filterBed && String(a.bedrooms) !== String(filterBed)) return false;
    if (filterPrice) {
      const range = PRICE_RANGES.find(r => r.value === filterPrice);
      if (range && (a.price < range.min || a.price >= range.max)) return false;
    }
    return true;
  });

  const isRent = listingType === 'thue';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary py-8 sm:py-10 relative overflow-hidden">
        {project?.image && (
          <div className="absolute inset-0 opacity-20">
            <img src={project.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {/* Breadcrumb */}
          {project?.parent && (
            <div className="flex items-center justify-center gap-2 text-white/60 text-xs mb-2">
              <Link to={`/du-an/${project.parent.slug}`} className="hover:text-white transition-colors">
                {project.parent.name}
              </Link>
              <span>›</span>
              <span className="text-white/90">{project?.name}</span>
            </div>
          )}
          <h1 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl mb-1 leading-tight">
            {project?.name?.toUpperCase() || '...'}
          </h1>
          {project?.description && (
            <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto">{project.description}</p>
          )}
          {/* Buy / Rent toggle */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Link
              to={`/du-an/${slug}?loai=ban`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${!isRent ? 'bg-white text-primary' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              Mua căn hộ
            </Link>
            <Link
              to={`/du-an/${slug}?loai=thue`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${isRent ? 'bg-white text-green-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              Cho thuê
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-projects (if has children) */}
      {project?.children?.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Các khu trong dự án</p>
            <div className="flex flex-wrap gap-2">
              {project.children.map(child => (
                <Link key={child.slug} to={`/du-an/${child.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-primary transition-all group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white transition-colors" />
                  {child.name}
                  {child.count_text && (
                    <span className="text-xs text-gray-400 group-hover:text-white/80">{child.count_text}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-sm sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap gap-2 items-center">
          <select value={filterBed} onChange={e => setFilterBed(e.target.value)}
            className="border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-primary">
            <option value="">Tất cả phòng ngủ</option>
            <option value="1">1 phòng ngủ</option>
            <option value="2">2 phòng ngủ</option>
            <option value="3">3 phòng ngủ</option>
          </select>
          <select value={filterPrice} onChange={e => setFilterPrice(e.target.value)}
            className="border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-primary">
            {PRICE_RANGES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {(filterBed || filterPrice) && (
            <button onClick={() => { setFilterBed(''); setFilterPrice(''); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium">
              Xóa lọc
            </button>
          )}
          <span className="text-gray-400 text-xs ml-auto font-medium">{filtered.length} căn</span>
        </div>
      </div>

      {/* Apartments grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-semibold text-gray-500 mb-2">
              {isRent ? 'Chưa có căn hộ cho thuê tại dự án này' : 'Chưa có căn hộ tại dự án này'}
            </p>
            <p className="text-sm mb-4">Liên hệ để được tư vấn danh sách mới nhất</p>
            <a href="tel:0973883550"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors">
              📞 Gọi ngay: 0973 883 550
            </a>
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
