import { Link } from 'react-router-dom';

const areas = [
  {
    name: 'CHUNG CƯ ĐẠI THANH',
    slug: 'dai-thanh',
    to: '/dai-thanh',
    count: '120+ căn đang bán',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
  },
  {
    name: 'CHUNG CƯ LINH ĐÀM',
    slug: 'linh-dam',
    to: '/linh-dam',
    count: '150+ căn đang bán',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80',
  },
  {
    name: 'KIM NHÀ - KIM LÚ',
    slug: 'kim-van-kim-lu',
    to: '/kim-van-kim-lu',
    count: '80+ căn đang bán',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
  },
  {
    name: 'KHU VỰC KHÁC',
    slug: 'khu-vuc-khac',
    to: '/chung-cu-ha-noi',
    count: '200+ căn đang bán',
    image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&q=80',
  },
];

export default function AreaSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">DỰ ÁN BẠN QUAN TÂM</h2>
        <div className="section-divider"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map(area => (
            <Link key={area.slug} to={area.to}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow block">
              <img
                src={area.image}
                alt={area.name}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-3">
                <div className="bg-primary/80 rounded-full p-2.5 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-center leading-snug drop-shadow">{area.name}</h3>
                <p className="text-xs text-white/90 mt-1">{area.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
