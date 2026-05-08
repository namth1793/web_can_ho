import { useState, useEffect } from 'react';
import api from '../lib/api';

const ADMIN_PASSWORD = 'oanhomes2024';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleString('vi-VN', { hour12: false });
}

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
  const [tab, setTab] = useState('contacts'); // contacts | projects
  const [contacts, setContacts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Add project form
  const [addForm, setAddForm] = useState({ name: '', slug: '', parent_slug: '', count_text: '', image: '', description: '' });
  const [addMsg, setAddMsg] = useState('');
  const [adding, setAdding] = useState(false);

  const headers = { 'x-admin-key': ADMIN_PASSWORD };

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
    if (tab === 'contacts') {
      api.get('/api/admin/contacts', { headers })
        .then(r => setContacts(r.data))
        .finally(() => setLoading(false));
    } else {
      api.get('/api/admin/projects', { headers })
        .then(r => setProjects(r.data))
        .finally(() => setLoading(false));
    }
  }, [authed, tab]);

  const filteredContacts = contacts.filter(c =>
    !search || c.phone?.includes(search)
  );

  const handleAddProject = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddMsg('');
    try {
      await api.post('/api/admin/projects', addForm, { headers });
      setAddMsg('✓ Thêm dự án thành công!');
      setAddForm({ name: '', slug: '', parent_slug: '', count_text: '', image: '', description: '' });
      // Reload projects
      const r = await api.get('/api/admin/projects', { headers });
      setProjects(r.data);
    } catch (err) {
      setAddMsg('✗ ' + (err.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setAdding(false);
    }
  };

  // Auto-generate slug from name
  const toSlug = (str) => str.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <p className="font-extrabold text-primary text-xl">ChungCuGiaReHN.vn</p>
            <p className="text-gray-500 text-sm mt-1">Trang quản trị</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input type="password" placeholder="Mật khẩu admin"
              value={pw} onChange={e => { setPw(e.target.value); setPwErr(''); }}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
              autoFocus />
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
      <header className="bg-primary text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow">
        <div>
          <p className="font-extrabold text-lg">ChungCuGiaReHN.vn</p>
          <p className="text-white/70 text-xs">Quản lý nội dung</p>
        </div>
        <button onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
          className="text-white/70 hover:text-white text-sm border border-white/30 px-3 py-1.5 rounded">
          Đăng xuất
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-0">
          {[
            { key: 'contacts', label: 'Khách hàng' },
            { key: 'projects', label: 'Quản lý Dự án' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ===== CONTACTS TAB ===== */}
        {tab === 'contacts' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Danh sách khách để lại SĐT</h1>
                <p className="text-gray-500 text-sm mt-0.5">Tổng: <span className="font-semibold text-primary">{contacts.length}</span> khách</p>
              </div>
              <input type="text" placeholder="Tìm theo số điện thoại..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary w-full sm:w-64" />
            </div>
            {loading ? (
              <div className="text-center py-16 text-gray-400">Đang tải...</div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">Chưa có dữ liệu</div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['#', 'Số điện thoại', 'Dự án', 'Khoảng giá', 'Ghi chú', 'Thời gian'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredContacts.map((c, i) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3">
                          <a href={`tel:${c.phone}`} className="font-semibold text-primary hover:underline">{c.phone}</a>
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{c.area || '—'}</td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{priceLabel[c.price_range] || c.price_range || '—'}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{c.message || '—'}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(c.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ===== PROJECTS TAB ===== */}
        {tab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add project form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thêm Dự Án / Phân Khu Mới</h2>
              <form onSubmit={handleAddProject} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tên dự án *</label>
                  <input type="text" required placeholder="VD: HH1 Linh Đàm"
                    value={addForm.name}
                    onChange={e => setAddForm({ ...addForm, name: e.target.value, slug: toSlug(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Slug (URL) *</label>
                  <input type="text" required placeholder="VD: hh1-linh-dam"
                    value={addForm.slug}
                    onChange={e => setAddForm({ ...addForm, slug: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-primary" />
                  <p className="text-xs text-gray-400 mt-1">URL: /du-an/{addForm.slug || 'slug'}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Thuộc dự án cha (nếu là phân khu)</label>
                  <select value={addForm.parent_slug}
                    onChange={e => setAddForm({ ...addForm, parent_slug: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="">— Không (dự án độc lập) —</option>
                    {projects.map(p => (
                      <option key={p.slug} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Số lượng căn</label>
                  <input type="text" placeholder="VD: 50+ căn"
                    value={addForm.count_text}
                    onChange={e => setAddForm({ ...addForm, count_text: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">URL ảnh đại diện</label>
                  <input type="text" placeholder="https://..."
                    value={addForm.image}
                    onChange={e => setAddForm({ ...addForm, image: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả ngắn</label>
                  <textarea placeholder="Mô tả dự án..."
                    value={addForm.description}
                    onChange={e => setAddForm({ ...addForm, description: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none" />
                </div>
                {addMsg && (
                  <p className={`text-sm font-medium ${addMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>{addMsg}</p>
                )}
                <button type="submit" disabled={adding}
                  className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition-colors text-sm disabled:opacity-60">
                  {adding ? 'Đang thêm...' : 'THÊM DỰ ÁN'}
                </button>
              </form>
            </div>

            {/* Projects list */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Danh sách dự án hiện có</h2>
              {loading ? (
                <div className="text-gray-400 text-sm">Đang tải...</div>
              ) : (
                <div className="space-y-3">
                  {projects.map(proj => (
                    <div key={proj.slug} className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-start gap-3">
                        {proj.image && (
                          <img src={proj.image} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{proj.name}</p>
                          <p className="text-xs text-gray-400 font-mono">/du-an/{proj.slug}</p>
                          {proj.count_text && <p className="text-xs text-gray-500 mt-0.5">{proj.count_text}</p>}
                        </div>
                      </div>
                      {proj.children?.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-1.5">
                          {proj.children.map(child => (
                            <div key={child.slug} className="flex items-center gap-2">
                              <span className="text-gray-300 text-xs">↳</span>
                              <div>
                                <p className="text-xs font-medium text-gray-700">{child.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">/du-an/{child.slug}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
