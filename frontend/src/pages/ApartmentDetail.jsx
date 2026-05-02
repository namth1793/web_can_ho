import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import ApartmentCard from '../components/ApartmentCard';

function formatPrice(p) {
  return new Intl.NumberFormat('vi-VN').format(p) + 'đ';
}

export default function ApartmentDetail() {
  const { id } = useParams();
  const [apt, setApt] = useState(null);
  const [related, setRelated] = useState([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ phone: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/apartments/${id}`)
      .then(r => {
        const { related: rel, ...data } = r.data;
        setApt(data);
        setRelated(rel || []);
        setImgIdx(0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleContact = async (e) => {
    e.preventDefault();
    if (!form.phone) return;
    await axios.post('/api/contacts', {
      phone: form.phone,
      area: apt?.area_slug,
      message: `Quan tâm căn: ${apt?.title}. ${form.message}`,
    }).catch(() => {});
    setSent(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (!apt) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy căn hộ</div>;

  const images = Array.isArray(apt.images) && apt.images.length ? apt.images : [apt.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to={`/${apt.area_slug}`} className="hover:text-primary">{apt.area_name}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{apt.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="relative">
                <img
                  src={images[imgIdx]}
                  alt={apt.title}
                  className="w-full h-72 md:h-96 object-cover"
                  onError={e => { e.target.src = apt.image; }}
                />
                {apt.is_hot === 1 && (
                  <span className="absolute top-4 left-4 hot-badge text-sm px-3 py-1">HOT</span>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
                      className={`w-16 h-12 object-cover rounded cursor-pointer flex-shrink-0 transition-all ${i === imgIdx ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">{apt.title}</h1>
              <p className="text-accent font-extrabold text-2xl mb-4">{formatPrice(apt.price)}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-100">
                {[
                  { label: 'Diện tích', value: `${apt.size}m²` },
                  { label: 'Phòng ngủ', value: `${apt.bedrooms} phòng` },
                  { label: 'Phòng tắm', value: `${apt.bathrooms} phòng` },
                  { label: 'Tầng', value: apt.floor || '—' },
                  { label: 'Hướng', value: apt.direction || '—' },
                  { label: 'Pháp lý', value: apt.legal || '—' },
                  { label: 'Khu vực', value: apt.area_name },
                  { label: 'Quận/Huyện', value: apt.district },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="font-semibold text-gray-800 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              <h2 className="font-bold text-gray-800 mb-3">Mô tả chi tiết</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{apt.description}</p>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Liên hệ tư vấn</h3>
              <p className="text-sm text-gray-500 mb-4">Nhận thông tin chi tiết & xem nhà miễn phí</p>

              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-700 font-semibold text-sm">Đã nhận yêu cầu!</p>
                  <p className="text-green-600 text-xs mt-1">Chúng tôi sẽ gọi lại ngay cho bạn.</p>
                  <button onClick={() => setSent(false)} className="mt-3 text-primary text-xs underline">Gửi lại</button>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-3">
                  <input
                    type="tel"
                    placeholder="Số điện thoại *"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                  />
                  <textarea
                    placeholder="Yêu cầu của bạn (tùy chọn)"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                  />
                  <button type="submit"
                    className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-sm">
                    GỬI YÊU CẦU TƯ VẤN
                  </button>
                </form>
              )}

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                <a href="tel:0973123456"
                  className="flex items-center justify-center gap-2 w-full border-2 border-primary text-primary font-bold py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Gọi ngay: 0973 123 456
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Căn hộ tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(r => <ApartmentCard key={r.id} apt={r} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
