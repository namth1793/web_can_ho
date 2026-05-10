import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const ADMIN_PASSWORD = 'oanhomes2024';
const H = { 'x-admin-key': ADMIN_PASSWORD };
const API_BASE = import.meta.env.VITE_API_URL || '';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(s) {
  if (!s) return '';
  return new Date(s).toLocaleString('vi-VN', { hour12: false });
}

function toSlug(s) {
  return s.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function fmtVND(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

const PRICE_LABEL = { 'duoi-2-ty': 'Dưới 2 tỷ', '2-3-ty': '2–3 tỷ', '3-4-ty': '3–4 tỷ', 'tren-4-ty': 'Trên 4 tỷ' };

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Spinner() {
  return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />;
}

function Badge({ children, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
    gold: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6 px-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} my-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';
const selectCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white';

// ─── Image Upload ─────────────────────────────────────────────────────────────

function ImageUpload({ value, onChange, label = 'Ảnh' }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: { 'x-admin-key': ADMIN_PASSWORD },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload thất bại');
      onChange(data.url);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      {value && (
        <div className="relative w-full h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          <img src={value} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/70 transition-colors">
            ×
          </button>
        </div>
      )}
      <label className={`flex items-center gap-2 cursor-pointer w-full border-2 border-dashed rounded-lg px-3 py-2 text-sm transition-colors ${uploading ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-500 hover:border-primary hover:text-primary'}`}>
        {uploading ? (
          <><Spinner /> Đang upload...</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {value ? 'Đổi ảnh' : 'Chọn ảnh'}
          </>
        )}
        <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleFile} />
      </label>
      {err && <p className="text-red-500 text-xs">{err}</p>}
    </div>
  );
}

// ─── Multi Image Upload ────────────────────────────────────────────────────────

function MultiImageUpload({ value, onChange }) {
  const urls = typeof value === 'string' ? value.split('\n').map(s => s.trim()).filter(Boolean) : (value || []);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setErr('');
    setUploading(true);
    try {
      const results = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${API_BASE}/api/admin/upload`, {
          method: 'POST',
          headers: { 'x-admin-key': ADMIN_PASSWORD },
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Upload thất bại');
        results.push(data.url);
      }
      onChange([...urls, ...results].join('\n'));
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const remove = (idx) => {
    const next = urls.filter((_, i) => i !== idx);
    onChange(next.join('\n'));
  };

  return (
    <div className="space-y-1.5">
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((u, i) => (
            <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
              <img src={u} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
              <button type="button" onClick={() => remove(i)}
                className="absolute top-0 right-0 bg-black/50 text-white w-4 h-4 flex items-center justify-center text-xs hover:bg-black/70 transition-colors">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <label className={`flex items-center gap-2 cursor-pointer w-full border-2 border-dashed rounded-lg px-3 py-2 text-sm transition-colors ${uploading ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-500 hover:border-primary hover:text-primary'}`}>
        {uploading ? (
          <><Spinner /> Đang upload...</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm ảnh ({urls.length} ảnh)
          </>
        )}
        <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={handleFile} />
      </label>
      {err && <p className="text-red-500 text-xs">{err}</p>}
    </div>
  );
}

// ─── Apartment Form ───────────────────────────────────────────────────────────

const EMPTY_APT = {
  title: '', project_slug: '', listing_type: 'ban', price: '', price_display: '',
  bedrooms: 2, bathrooms: 1, size: '', short_desc: '', description: '',
  location: '', district: '', floor: '', direction: '', legal: '',
  image: '', images: '', is_hot: false, status: 'available',
};

function ApartmentForm({ initial, projects, onSave, onClose }) {
  const [form, setForm] = useState(() => initial
    ? { ...initial, images: Array.isArray(initial.images) ? initial.images.join('\n') : '' }
    : EMPTY_APT
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const autoPriceDisplay = () => {
    if (!form.price) return;
    const num = Number(form.price);
    const display = form.listing_type === 'thue'
      ? fmtVND(num) + '/tháng'
      : fmtVND(num);
    set('price_display', display);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const payload = {
        ...form,
        images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
        price: Number(form.price),
      };
      if (initial?.id) {
        await api.put(`/api/admin/apartments/${initial.id}`, payload, { headers: H });
      } else {
        await api.post('/api/admin/apartments', payload, { headers: H });
      }
      onSave();
    } catch (e) {
      setErr(e.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  // All projects flat (for select)
  const flatProjects = [];
  projects.forEach(p => {
    flatProjects.push(p);
    (p.children || []).forEach(c => flatProjects.push({ ...c, _indent: true }));
  });

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Tiêu đề" required>
          <input className={inputCls} required value={form.title}
            onChange={e => set('title', e.target.value)} placeholder="VD: 2PN Linh Đàm – View Hồ" />
        </Field>
        <Field label="Dự án" required>
          <select className={selectCls} required value={form.project_slug}
            onChange={e => set('project_slug', e.target.value)}>
            <option value="">— Chọn dự án —</option>
            {flatProjects.map(p => (
              <option key={p.slug} value={p.slug}>
                {p._indent ? `  ↳ ${p.name}` : p.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Loại" required>
          <select className={selectCls} value={form.listing_type} onChange={e => set('listing_type', e.target.value)}>
            <option value="ban">Mua – Bán</option>
            <option value="thue">Cho thuê</option>
          </select>
        </Field>
        <Field label="Giá (VNĐ)" required>
          <input className={inputCls} type="number" required value={form.price}
            onChange={e => set('price', e.target.value)}
            onBlur={autoPriceDisplay}
            placeholder={form.listing_type === 'thue' ? '12000000' : '3500000000'} />
        </Field>
        <Field label="Hiển thị giá" hint="Tự động khi blur giá">
          <input className={inputCls} value={form.price_display}
            onChange={e => set('price_display', e.target.value)}
            placeholder="3.500.000.000đ" />
        </Field>
        <Field label="Trạng thái">
          <select className={selectCls} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="available">Đang bán</option>
            <option value="sold">Đã bán</option>
            <option value="rented">Đã thuê</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Phòng ngủ">
          <input className={inputCls} type="number" min={0} value={form.bedrooms}
            onChange={e => set('bedrooms', e.target.value)} />
        </Field>
        <Field label="Phòng tắm">
          <input className={inputCls} type="number" min={0} value={form.bathrooms}
            onChange={e => set('bathrooms', e.target.value)} />
        </Field>
        <Field label="Diện tích (m²)">
          <input className={inputCls} type="number" value={form.size}
            onChange={e => set('size', e.target.value)} placeholder="60" />
        </Field>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Tầng">
          <input className={inputCls} value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="Tầng 12" />
        </Field>
        <Field label="Hướng">
          <input className={inputCls} value={form.direction} onChange={e => set('direction', e.target.value)} placeholder="Đông Nam" />
        </Field>
        <Field label="Pháp lý">
          <input className={inputCls} value={form.legal} onChange={e => set('legal', e.target.value)} placeholder="Sổ đỏ" />
        </Field>
        <Field label="Quận/Huyện">
          <input className={inputCls} value={form.district} onChange={e => set('district', e.target.value)} placeholder="Hoàng Mai" />
        </Field>
      </div>

      <Field label="Địa chỉ / Khu vực">
        <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)}
          placeholder="HH Linh Đàm, Hoàng Mai" />
      </Field>

      <Field label="Mô tả ngắn">
        <input className={inputCls} value={form.short_desc} onChange={e => set('short_desc', e.target.value)}
          placeholder="Full nội thất – Sổ đỏ chính chủ" />
      </Field>

      <Field label="Mô tả chi tiết">
        <textarea className={inputCls} rows={3} value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Căn hộ 2PN tại..." />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Ảnh bìa">
          <ImageUpload value={form.image} onChange={v => set('image', v)} />
        </Field>
        <Field label="Ảnh chi tiết (nhiều ảnh)">
          <MultiImageUpload value={form.images} onChange={v => set('images', v)} />
        </Field>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_hot} onChange={e => set('is_hot', e.target.checked)}
            className="w-4 h-4 accent-accent" />
          <span className="text-sm font-medium text-gray-700">Đánh dấu HOT</span>
        </label>
      </div>

      {err && <p className="text-red-500 text-sm">{err}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 text-sm">
          Hủy
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {saving && <Spinner />}
          {initial?.id ? 'Lưu thay đổi' : 'Thêm tin đăng'}
        </button>
      </div>
    </form>
  );
}

// ─── Testimonial Form ────────────────────────────────────────────────────────

const EMPTY_TEST = { name: '', location: '', avatar: '', content: '', rating: 5 };

function TestimonialForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_TEST);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      if (initial?.id) await api.put(`/api/admin/testimonials/${initial.id}`, form, { headers: H });
      else await api.post('/api/admin/testimonials', form, { headers: H });
      onSave();
    } catch (e) {
      setErr(e.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={save} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tên khách hàng" required>
          <input className={inputCls} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Anh Tuấn" />
        </Field>
        <Field label="Khu vực">
          <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Hoàng Mai" />
        </Field>
      </div>
      <Field label="Ảnh đại diện">
        <ImageUpload value={form.avatar} onChange={v => set('avatar', v)} />
      </Field>
      <Field label="Nội dung đánh giá" required>
        <textarea className={inputCls} rows={3} required value={form.content}
          onChange={e => set('content', e.target.value)} placeholder="Mình mua được căn giá rất tốt..." />
      </Field>
      <Field label="Số sao (1-5)">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" onClick={() => set('rating', n)}
              className={`text-2xl transition-transform hover:scale-110 ${n <= form.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </button>
          ))}
        </div>
      </Field>
      {err && <p className="text-red-500 text-sm">{err}</p>}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 text-sm">Hủy</button>
        <button type="submit" disabled={saving}
          className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {saving && <Spinner />}{initial?.id ? 'Lưu' : 'Thêm đánh giá'}
        </button>
      </div>
    </form>
  );
}

// ─── Project Form ─────────────────────────────────────────────────────────────

const EMPTY_PROJ = { name: '', slug: '', parent_slug: '', count_text: '', image: '', description: '' };

function ProjectForm({ initial, projects, onSave, onClose }) {
  const [form, setForm] = useState(initial ? {
    name: initial.name, slug: initial.slug, parent_slug: '',
    count_text: initial.count_text || '', image: initial.image || '', description: initial.description || ''
  } : EMPTY_PROJ);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      if (initial?.id) {
        await api.put(`/api/admin/projects/${initial.id}`, form, { headers: H });
      } else {
        await api.post('/api/admin/projects', form, { headers: H });
      }
      onSave();
    } catch (e) {
      setErr(e.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={save} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tên dự án" required>
          <input className={inputCls} required value={form.name}
            onChange={e => set('name', e.target.value) || (!initial && set('slug', toSlug(e.target.value)))}
            placeholder="HH1 Linh Đàm" />
        </Field>
        <Field label="Slug (URL)" required hint={`URL: /du-an/${form.slug || 'slug'}`}>
          <input className={`${inputCls} font-mono`} required value={form.slug}
            onChange={e => set('slug', e.target.value)} placeholder="hh1-linh-dam" disabled={!!initial} />
        </Field>
      </div>
      {!initial && (
        <Field label="Thuộc dự án cha (nếu là phân khu)">
          <select className={selectCls} value={form.parent_slug} onChange={e => set('parent_slug', e.target.value)}>
            <option value="">— Dự án độc lập —</option>
            {projects.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </Field>
      )}
      <Field label="Số căn">
        <input className={inputCls} value={form.count_text} onChange={e => set('count_text', e.target.value)} placeholder="50+ căn" />
      </Field>
      <Field label="Ảnh đại diện dự án">
        <ImageUpload value={form.image} onChange={v => set('image', v)} />
      </Field>
      <Field label="Mô tả">
        <textarea className={inputCls} rows={2} value={form.description}
          onChange={e => set('description', e.target.value)} placeholder="Khu đô thị..." />
      </Field>
      {err && <p className="text-red-500 text-sm">{err}</p>}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 text-sm">Hủy</button>
        <button type="submit" disabled={saving}
          className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {saving && <Spinner />}{initial?.id ? 'Lưu' : 'Thêm dự án'}
        </button>
      </div>
    </form>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function Confirm({ msg, onOk, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <p className="text-gray-800 font-semibold mb-1">Xác nhận xóa</p>
        <p className="text-gray-500 text-sm mb-5">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2 rounded-lg text-sm hover:bg-gray-50">Hủy</button>
          <button onClick={onOk} className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-red-600">Xóa</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1');
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [tab, setTab] = useState('contacts');

  // Data
  const [contacts, setContacts] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search / filter
  const [contactSearch, setContactSearch] = useState('');
  const [aptSearch, setAptSearch] = useState('');

  // Modals
  const [aptModal, setAptModal] = useState(null); // null | 'add' | apt obj
  const [testModal, setTestModal] = useState(null);
  const [projModal, setProjModal] = useState(null);
  const [confirm, setConfirm] = useState(null); // { msg, onOk }

  const login = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('admin_auth', '1'); setAuthed(true); }
    else setPwErr('Sai mật khẩu!');
  };

  const load = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    try {
      if (tab === 'contacts') {
        const r = await api.get('/api/admin/contacts', { headers: H });
        setContacts(r.data);
      } else if (tab === 'apartments') {
        const r = await api.get('/api/admin/apartments', { headers: H });
        setApartments(r.data);
        const rp = await api.get('/api/admin/projects', { headers: H });
        setProjects(rp.data);
      } else if (tab === 'projects') {
        const r = await api.get('/api/admin/projects', { headers: H });
        setProjects(r.data);
      } else if (tab === 'testimonials') {
        const r = await api.get('/api/admin/testimonials', { headers: H });
        setTestimonials(r.data);
      }
    } catch (e) { /* silent */ }
    finally { setLoading(false); }
  }, [authed, tab]);

  useEffect(() => { load(); }, [load]);

  const del = (msg, fn) => setConfirm({ msg, onOk: async () => { setConfirm(null); await fn(); load(); } });

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-navy flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="font-extrabold text-primary text-xl">ChungCuGiaReHN.vn</p>
            <p className="text-gray-400 text-sm mt-1">Trang quản trị nội dung</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div className="relative">
              <input type="password" placeholder="Mật khẩu admin"
                value={pw} onChange={e => { setPw(e.target.value); setPwErr(''); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus />
            </div>
            {pwErr && <p className="text-red-500 text-xs text-center">{pwErr}</p>}
            <button type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm shadow-lg shadow-primary/30">
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin layout ──
  const TABS = [
    { key: 'contacts', label: 'Khách hàng', icon: '👥' },
    { key: 'apartments', label: 'Tin đăng', icon: '🏠' },
    { key: 'projects', label: 'Dự án', icon: '🏗️' },
    { key: 'testimonials', label: 'Đánh giá', icon: '⭐' },
  ];

  const filteredContacts = contacts.filter(c => !contactSearch || c.phone?.includes(contactSearch) || c.message?.toLowerCase().includes(contactSearch.toLowerCase()));
  const filteredApts = apartments.filter(a => !aptSearch || a.title?.toLowerCase().includes(aptSearch.toLowerCase()) || a.project_name?.toLowerCase().includes(aptSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-sm leading-tight">ChungCuGiaReHN.vn</p>
            <p className="text-white/60 text-[10px]">Quản trị nội dung</p>
          </div>
        </div>
        <button onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
          className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs border border-white/30 px-3 py-1.5 rounded-lg transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex min-w-max">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5
                ${tab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ════ CONTACTS ════ */}
        {tab === 'contacts' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Khách hàng để lại SĐT</h1>
                <p className="text-gray-400 text-xs mt-0.5">{contacts.length} liên hệ</p>
              </div>
              <input type="text" placeholder="Tìm số điện thoại hoặc ghi chú..."
                value={contactSearch} onChange={e => setContactSearch(e.target.value)}
                className="sm:ml-auto border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary w-full sm:w-72" />
            </div>
            {loading ? <div className="text-center py-20 text-gray-400"><Spinner /></div> : (
              <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['#', 'SĐT', 'Dự án', 'Khoảng giá', 'Ghi chú', 'Thời gian', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredContacts.length === 0
                      ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">Chưa có liên hệ</td></tr>
                      : filteredContacts.map((c, i) => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-3">
                            <a href={`tel:${c.phone}`} className="font-semibold text-primary hover:underline text-sm">{c.phone}</a>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">{c.area || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{PRICE_LABEL[c.price_range] || c.price_range || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">{c.message || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(c.created_at)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => del('Xóa liên hệ này?', () => api.delete(`/api/admin/contacts/${c.id}`, { headers: H }).then(() => setContacts(prev => prev.filter(x => x.id !== c.id))))}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════ APARTMENTS ════ */}
        {tab === 'apartments' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Quản lý Tin đăng</h1>
                <p className="text-gray-400 text-xs mt-0.5">{apartments.length} tin đăng</p>
              </div>
              <input type="text" placeholder="Tìm tiêu đề, dự án..."
                value={aptSearch} onChange={e => setAptSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary sm:w-64" />
              <button onClick={() => setAptModal('add')}
                className="sm:ml-auto flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm tin đăng
              </button>
            </div>

            {loading ? <div className="text-center py-20 text-gray-400"><Spinner /></div> : (
              <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Ảnh & Tiêu đề', 'Dự án', 'Loại', 'Giá', 'Chi tiết', 'Trạng thái', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredApts.length === 0
                      ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">Chưa có tin đăng</td></tr>
                      : filteredApts.map(apt => (
                        <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={apt.image} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0 bg-gray-100"
                                onError={e => { e.target.style.display = 'none'; }} />
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2 max-w-[200px]">{apt.title}</p>
                                {apt.is_hot === 1 && <Badge color="red">HOT</Badge>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">{apt.project_name}</td>
                          <td className="px-4 py-3">
                            <Badge color={apt.listing_type === 'thue' ? 'green' : 'blue'}>
                              {apt.listing_type === 'thue' ? 'Cho thuê' : 'Bán'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-xs font-bold text-accent whitespace-nowrap">{apt.price_display}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {apt.bedrooms}PN · {apt.bathrooms}WC · {apt.size}m²
                          </td>
                          <td className="px-4 py-3">
                            <Badge color={apt.status === 'available' ? 'green' : apt.status === 'sold' ? 'gray' : 'blue'}>
                              {apt.status === 'available' ? 'Đang bán' : apt.status === 'sold' ? 'Đã bán' : 'Đã thuê'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setAptModal(apt)} title="Sửa"
                                className="p-1.5 text-gray-400 hover:text-primary rounded hover:bg-primary/10 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button onClick={() => del(`Xóa "${apt.title}"?`, () => api.delete(`/api/admin/apartments/${apt.id}`, { headers: H }).then(load))} title="Xóa"
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════ PROJECTS ════ */}
        {tab === 'projects' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Quản lý Dự án</h1>
                <p className="text-gray-400 text-xs mt-0.5">{projects.length} dự án gốc</p>
              </div>
              <button onClick={() => setProjModal('add')}
                className="ml-auto flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm dự án
              </button>
            </div>

            {loading ? <div className="text-center py-20 text-gray-400"><Spinner /></div> : (
              <div className="space-y-3">
                {projects.map(proj => (
                  <div key={proj.slug} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Parent project row */}
                    <div className="flex items-center gap-4 px-5 py-4">
                      {proj.image
                        ? <img src={proj.image} alt="" className="w-14 h-14 object-cover rounded-xl shrink-0" onError={e => { e.target.style.display = 'none'; }} />
                        : <div className="w-14 h-14 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center text-gray-300 text-xl">🏗️</div>
                      }
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-800">{proj.name}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">/du-an/{proj.slug}</p>
                        {proj.count_text && <p className="text-xs text-gray-500 mt-0.5">{proj.count_text}</p>}
                        {proj.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{proj.description}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {proj.children?.length > 0 && (
                          <Badge color="blue">{proj.children.length} phân khu</Badge>
                        )}
                        <button onClick={() => setProjModal(proj)} title="Sửa"
                          className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors ml-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => del(`Xóa "${proj.name}"? Các phân khu sẽ trở thành độc lập.`, () => api.delete(`/api/admin/projects/${proj.id}`, { headers: H }).then(load))}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Children */}
                    {proj.children?.length > 0 && (
                      <div className="border-t border-gray-50 divide-y divide-gray-50">
                        {proj.children.map(child => (
                          <div key={child.slug} className="flex items-center gap-3 px-5 py-3 bg-gray-50/50">
                            <div className="w-4 text-gray-300 text-xs shrink-0">↳</div>
                            {child.image
                              ? <img src={child.image} alt="" className="w-9 h-9 object-cover rounded-lg shrink-0" onError={e => { e.target.style.display = 'none'; }} />
                              : <div className="w-9 h-9 bg-gray-100 rounded-lg shrink-0" />
                            }
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-700 text-sm">{child.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">/du-an/{child.slug}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => setProjModal(child)} className="p-1.5 text-gray-400 hover:text-primary rounded hover:bg-primary/10 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button onClick={() => del(`Xóa phân khu "${child.name}"?`, () => api.delete(`/api/admin/projects/${child.id}`, { headers: H }).then(load))}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
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
        )}

        {/* ════ TESTIMONIALS ════ */}
        {tab === 'testimonials' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Quản lý Đánh giá</h1>
                <p className="text-gray-400 text-xs mt-0.5">{testimonials.length} đánh giá</p>
              </div>
              <button onClick={() => setTestModal('add')}
                className="ml-auto flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm đánh giá
              </button>
            </div>

            {loading ? <div className="text-center py-20 text-gray-400"><Spinner /></div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.length === 0
                  ? <div className="col-span-3 text-center py-16 text-gray-400">Chưa có đánh giá</div>
                  : testimonials.map(t => (
                    <div key={t.id} className="bg-white rounded-xl shadow-sm p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <img src={t.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} alt={t.name}
                          className="w-11 h-11 rounded-full object-cover shrink-0"
                          onError={e => { e.target.src = 'https://randomuser.me/api/portraits/lego/1.jpg'; }} />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                          <p className="text-xs text-gray-400">{t.location}</p>
                          <div className="flex gap-0.5 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`text-sm ${i < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setTestModal(t)} className="p-1.5 text-gray-400 hover:text-primary rounded hover:bg-primary/10 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => del(`Xóa đánh giá của "${t.name}"?`, () => api.delete(`/api/admin/testimonials/${t.id}`, { headers: H }).then(load))}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">"{t.content}"</p>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {aptModal && (
        <Modal title={aptModal === 'add' ? 'Thêm tin đăng mới' : `Sửa: ${aptModal.title}`}
          onClose={() => setAptModal(null)} wide>
          <ApartmentForm
            initial={aptModal === 'add' ? null : aptModal}
            projects={projects}
            onSave={() => { setAptModal(null); load(); }}
            onClose={() => setAptModal(null)} />
        </Modal>
      )}

      {testModal && (
        <Modal title={testModal === 'add' ? 'Thêm đánh giá mới' : `Sửa đánh giá: ${testModal.name}`}
          onClose={() => setTestModal(null)}>
          <TestimonialForm
            initial={testModal === 'add' ? null : testModal}
            onSave={() => { setTestModal(null); load(); }}
            onClose={() => setTestModal(null)} />
        </Modal>
      )}

      {projModal && (
        <Modal title={projModal === 'add' ? 'Thêm dự án / phân khu' : `Sửa: ${projModal.name}`}
          onClose={() => setProjModal(null)}>
          <ProjectForm
            initial={projModal === 'add' ? null : projModal}
            projects={projects}
            onSave={() => { setProjModal(null); load(); }}
            onClose={() => setProjModal(null)} />
        </Modal>
      )}

      {confirm && <Confirm msg={confirm.msg} onOk={confirm.onOk} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
