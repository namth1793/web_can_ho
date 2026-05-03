import { useState } from 'react';
import axios from 'axios';

export default function LeadForm() {
  const [form, setForm] = useState({ phone: '', area: '', price_range: '', bedrooms: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) { setMsg('Vui lòng nhập số điện thoại!'); return; }
    setLoading(true);
    try {
      await axios.post('/api/contacts', form);
      setMsg('Đã ghi nhận! Chúng tôi sẽ gọi lại ngay.');
      setForm({ phone: '', area: '', price_range: '', bedrooms: '' });
    } catch {
      setMsg('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <section className="bg-primary py-6 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-white font-bold text-lg md:text-xl text-center mb-4 tracking-wide">
          NHẬN DANH SÁCH CĂN HỘ PHÙ HỢP VỚI BẠN
        </h2>
        {msg && (
          <div className={`text-center text-sm font-semibold mb-3 py-2 rounded ${msg.includes('lỗi') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {msg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="tel"
            placeholder="Nhập số điện thoại"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="flex-1 px-4 py-3 rounded text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <select
            value={form.area}
            onChange={e => setForm({ ...form, area: e.target.value })}
            className="flex-1 px-4 py-3 rounded text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white">
            <option value="">Chọn dự án</option>
            <option value="dai-thanh">Đại Thanh</option>
            <option value="linh-dam">Linh Đàm</option>
            <option value="kim-van-kim-lu">Kim Văn - Kim Lú</option>
            <option value="khu-vuc-khac">Khu vực khác</option>
          </select>
          <select
            value={form.price_range}
            onChange={e => setForm({ ...form, price_range: e.target.value })}
            className="flex-1 px-4 py-3 rounded text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white">
            <option value="">Khoảng giá</option>
            <option value="duoi-2-ty">Dưới 2 tỷ</option>
            <option value="2-3-ty">2 – 3 tỷ</option>
            <option value="3-4-ty">3 – 4 tỷ</option>
            <option value="tren-4-ty">Trên 4 tỷ</option>
          </select>
          <select
            value={form.bedrooms}
            onChange={e => setForm({ ...form, bedrooms: e.target.value })}
            className="flex-1 px-4 py-3 rounded text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white">
            <option value="">Số phòng ngủ</option>
            <option value="1">1 phòng ngủ</option>
            <option value="2">2 phòng ngủ</option>
            <option value="3">3 phòng ngủ</option>
            <option value="studio">Studio</option>
          </select>
          <button type="submit" disabled={loading}
            className="bg-gold text-gray-900 font-bold px-8 py-3 rounded hover:bg-yellow-500 transition-colors text-sm whitespace-nowrap shadow">
            {loading ? 'ĐANG GỬI...' : 'NHẬN NGAY'}
          </button>
        </form>
      </div>
    </section>
  );
}
