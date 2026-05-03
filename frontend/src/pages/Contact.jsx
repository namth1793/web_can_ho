import { useState } from 'react';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';

export default function Contact() {
  const [form, setForm] = useState({ phone: '', area: '', price_range: '', bedrooms: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) return;
    setLoading(true);
    try {
      await api.post('/api/contacts', form);
      setSent(true);
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-white font-extrabold text-3xl md:text-4xl mb-2">LIÊN HỆ VỚI CHÚNG TÔI</h1>
          <p className="text-white/80 text-sm">Tư vấn miễn phí – Xem nhà trong ngày – Hỗ trợ vay ngân hàng</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>
            <div className="space-y-5">
              {[
                {
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>,
                  label: 'Hotline', value: '0973 883 550', href: 'tel:0973883550'
                },
                {
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>,
                  label: 'Email', value: 'chungcugiarehn@gmail.com', href: 'mailto:chungcugiarehn@gmail.com'
                },
                {
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>,
                  label: 'Địa chỉ', value: 'Hoàng Mai, Hà Nội'
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
                  label: 'Giờ làm việc', value: 'Thứ 2 – CN: 7:30 – 21:00'
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="font-semibold text-gray-800 hover:text-primary">{item.value}</a>
                      : <p className="font-semibold text-gray-800">{item.value}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 rounded-xl overflow-hidden shadow-sm border border-gray-200 h-64">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=105.8100,20.9600,105.8800,21.0000&layer=mapnik&marker=20.9800,105.8450"
                width="100%" height="100%" style={{ border: 0 }}
                title="Bản đồ" loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Nhận tư vấn miễn phí</h2>
            <p className="text-gray-500 text-sm mb-6">Điền thông tin bên dưới, chúng tôi sẽ liên hệ ngay!</p>

            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Gửi thành công!</h3>
                <p className="text-gray-500 text-sm mb-4">Chúng tôi sẽ gọi lại trong vòng 15 phút.</p>
                <button onClick={() => setSent(false)} className="text-primary text-sm font-semibold underline">Gửi thêm yêu cầu</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="tel" placeholder="Số điện thoại *" required
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none focus:border-primary bg-white">
                  <option value="">Chọn dự án quan tâm</option>
                  <option value="dai-thanh">Đại Thanh</option>
                  <option value="linh-dam">Linh Đàm</option>
                  <option value="kim-van-kim-lu">Kim Văn - Kim Lú</option>
                  <option value="khu-vuc-khac">Khu vực khác</option>
                </select>
                <select value={form.price_range} onChange={e => setForm({ ...form, price_range: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 focus:outline-none focus:border-primary bg-white">
                  <option value="">Khoảng giá dự kiến</option>
                  <option value="duoi-2-ty">Dưới 2 tỷ</option>
                  <option value="2-3-ty">2 – 3 tỷ</option>
                  <option value="3-4-ty">3 – 4 tỷ</option>
                  <option value="tren-4-ty">Trên 4 tỷ</option>
                </select>
                <textarea rows={4} placeholder="Nội dung yêu cầu (tùy chọn)"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none" />
                <button type="submit" disabled={loading}
                  className="w-full bg-accent text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition-colors text-sm shadow">
                  {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU TƯ VẤN NGAY'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
