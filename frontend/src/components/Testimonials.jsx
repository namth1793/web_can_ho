import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useRefreshSignal } from '../contexts/RefreshContext';

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const refresh = useRefreshSignal();

  useEffect(() => {
    api.get('/api/testimonials').then(r => setItems(r.data)).catch(() => {});
  }, [refresh]);

  if (items.length === 0) return null;

  const visible = [];
  for (let i = 0; i < 3; i++) {
    visible.push(items[(idx + i) % items.length]);
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI?</h2>
        <div className="section-divider"></div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {visible.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=1B4F9C&color=fff`; }}
                  />
                  <div>
                    <p className="font-bold text-sm text-gray-800">– {t.name}</p>
                    <p className="text-xs text-gray-500">({t.location})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setIdx((idx - 1 + items.length) % items.length)}
              className="w-9 h-9 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIdx((idx + 1) % items.length)}
              className="w-9 h-9 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
