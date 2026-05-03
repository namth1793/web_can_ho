import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'TRANG CHỦ', to: '/' },
  {
    label: 'CHUNG CƯ HÀ NỘI', to: '/chung-cu-ha-noi',
    dropdown: [
      { label: 'Tất cả căn hộ', to: '/chung-cu-ha-noi' },
      { label: 'Căn hộ 1 phòng ngủ', to: '/chung-cu-ha-noi?bedrooms=1' },
      { label: 'Căn hộ 2 phòng ngủ', to: '/chung-cu-ha-noi?bedrooms=2' },
      { label: 'Căn hộ 3 phòng ngủ', to: '/chung-cu-ha-noi?bedrooms=3' },
    ]
  },
  { label: 'ĐẠI THANH', to: '/dai-thanh' },
  { label: 'LINH ĐÀM', to: '/linh-dam' },
  { label: 'KIM VĂN - KIM LÚ', to: '/kim-van-kim-lu' },
  { label: 'LIÊN HỆ', to: '/lien-he' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight">
            <span className="text-primary font-extrabold text-lg leading-5">ChungCuGiaReHN.vn</span>
            <span className="text-gray-500 text-xs font-medium">by Oanh Homes</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}>
                  <Link to={link.to}
                    className={`px-3 py-2 text-sm font-semibold flex items-center gap-1 hover:text-primary transition-colors ${location.pathname === link.to ? 'text-primary' : 'text-gray-700'}`}>
                    {link.label}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  {dropOpen && (
                    <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-b-lg w-52 py-1 z-50">
                      {link.dropdown.map(d => (
                        <Link key={d.to} to={d.to}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors"
                          onClick={() => setDropOpen(false)}>
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.label} to={link.to}
                  className={`px-3 py-2 text-sm font-semibold hover:text-primary transition-colors ${location.pathname === link.to ? 'text-primary' : 'text-gray-700'}`}>
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Phone */}
          <a href="tel:0973883550"
            className="hidden lg:flex items-center gap-2 text-accent font-bold text-base hover:opacity-80">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            0973 883 550
          </a>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-2">
            {navLinks.map(link => (
              <Link key={link.label} to={link.to}
                className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-primary hover:text-white"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <a href="tel:0973883550" className="block px-4 py-3 text-accent font-bold text-sm">
              📞 0973 883 550
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
