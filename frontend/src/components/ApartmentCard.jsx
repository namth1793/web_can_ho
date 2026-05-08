import { Link } from 'react-router-dom';

export default function ApartmentCard({ apt }) {
  const isRent = apt.listing_type === 'thue';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
      <div className="relative">
        <img
          src={apt.image}
          alt={apt.title}
          className="w-full h-44 sm:h-52 object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80'; }}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {apt.is_hot === 1 && (
            <span className="hot-badge">HOT</span>
          )}
          {isRent && (
            <span className="bg-green-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Cho thuê
            </span>
          )}
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 font-medium mb-1">{apt.project_name}</p>
        <h3 className="text-primary font-bold text-xs sm:text-sm uppercase mb-2 leading-snug line-clamp-2">
          {apt.title}
        </h3>
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {apt.size}m²
          </span>
          <span className="text-gray-300">•</span>
          <span>{apt.bedrooms}PN</span>
          <span className="text-gray-300">•</span>
          <span>{apt.bathrooms}WC</span>
        </div>
        {apt.short_desc && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">{apt.short_desc}</p>
        )}
        <p className="flex items-center gap-1 text-xs text-gray-500 mb-3 line-clamp-1">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {apt.location}
        </p>
        <p className={`font-extrabold text-sm sm:text-base mb-3 sm:mb-4 ${isRent ? 'text-green-600' : 'text-accent'}`}>
          {apt.price_display}
        </p>
        <div className="flex gap-2 mt-auto">
          <Link to={`/can-ho/${apt.id}`}
            className="flex-1 text-center border border-primary text-primary text-xs font-semibold py-2 rounded hover:bg-primary hover:text-white transition-colors">
            Xem chi tiết
          </Link>
          <a href="tel:0973883550"
            className="flex-1 text-center bg-primary text-white text-xs font-semibold py-2 rounded hover:bg-blue-800 transition-colors">
            Gọi ngay
          </a>
        </div>
      </div>
    </div>
  );
}
