import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useRefreshSignal } from '../contexts/RefreshContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';

export default function AreaSection() {
  const [projects, setProjects] = useState([]);
  const refresh = useRefreshSignal();

  useEffect(() => {
    api.get('/api/projects')
      .then(r => {
        setProjects(r.data.filter(p => !p.parent_id));
      })
      .catch(() => {});
  }, [refresh]);

  if (projects.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">DỰ ÁN BẠN QUAN TÂM</h2>
        <div className="section-divider"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {projects.map(proj => (
            <Link key={proj.slug} to={`/du-an/${proj.slug}`}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all block">
              <img
                src={proj.image || FALLBACK_IMAGE}
                alt={proj.name}
                className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => { e.target.src = FALLBACK_IMAGE; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-3">
                <h3 className="font-bold text-xs sm:text-sm text-center leading-snug drop-shadow">
                  {proj.name.toUpperCase()}
                </h3>
                {proj.count_text && (
                  <p className="text-[10px] sm:text-xs text-white/80 mt-0.5">{proj.count_text}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
