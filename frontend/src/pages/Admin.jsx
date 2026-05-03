import { useState, useEffect } from 'react';
import axios from 'axios';

const ADMIN_PASSWORD = 'oanhomes2024';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleString('vi-VN', { hour12: false });
}

const areaLabel = {
  'dai-thanh': 'Đại Thanh',
  'linh-dam': 'Linh Đàm',
  'kim-van-kim-lu': 'Kim Văn - Kim Lú',
  'khu-vuc-khac': 'Khu vực khác',
};
const priceLabel = {
  'duoi-2-ty': 'Dưới 2 tỷ',
  '2-3-ty': '2 – 3 tỷ',
  '3-4-ty': '3 – 4 tỷ',
  'tren-4-ty': 'Trên 4 tỷ',
};

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1');
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const login = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      setAuthed(true);
    } else {
      setPwErr('Sai mật khẩu!');
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    axios.get('/api/admin/contacts', { headers: { 'x-admin-key': ADMIN_PASSWORD } })
      .then(r => setContacts(r.data))
      .finally(() => setLoading(false));
  }, [authed]);

  const filtered = contacts.filter(c =>
    !search || c.phone?.includes(search)
  );

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <p className="font-extrabold text-primary text-xl">ChungCuGiaReHN.vn</p>
            <p className="text-gray-500 text-sm mt-1">Trang quản trị</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              placeholder="Mật khẩu admin"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwErr(''); }}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
              autoFocus
            />
            {pwErr && <p className="text-red-500 text-xs">{pwErr}</p>}
            <button type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors text-sm">
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow">
        <div>
          <p className="font-extrabold text-lg">ChungCuGiaReHN.vn</p>
          <p className="text-white/70 text-xs">Quản lý khách hàng</p>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
          className="text-white/70 hover:text-white text-sm border border-white/30 px-3 py-1.5 rounded">
          Đăng xuất
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Danh sách khách hàng để lại SĐT</h1>
            <p className="text-gray-500 text-sm mt-0.5">Tổng: <span className="font-semibold text-primary">{contacts.length}</span> khách</p>
          </div>
          <input
            type="text"
            placeholder="Tìm theo số điện thoại..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary w-full sm:w-64"
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Chưa có dữ liệu</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Số điện thoại</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dự án</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Khoảng giá</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Số PN</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ghi chú</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${c.phone}`} className="font-semibold text-primary hover:underline">{c.phone}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{areaLabel[c.area] || c.area || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{priceLabel[c.price_range] || c.price_range || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{c.bedrooms ? `${c.bedrooms} PN` : '—'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{c.message || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
