import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';

export default function Navbar() {
  const [projects, setProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);
  const [mobileBuyOpen, setMobileBuyOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(null); // slug of expanded sub-parent
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const searchTimer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get('/api/projects?include_children=1')
      .then(r => setProjects(r.data))
      .catch(() => {});
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMenuOpen(false);
    setBuyOpen(false);
    setRentOpen(false);
    setSearchOpen(false);
    setSearchQ('');
  }, [location.pathname]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doSearch = useCallback((q) => {
    if (!q.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    setSearching(true);
    api.get('/api/apartments', { params: { search: q, limit: 6 } })
      .then(r => { setSearchResults(r.data); setSearchOpen(true); })
      .catch(() => {})
      .finally(() => setSearching(false));
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQ(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    searchTimer.current = setTimeout(() => doSearch(q), 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    setSearchOpen(false);
    navigate(`/tim-kiem?q=${encodeURIComponent(searchQ.trim())}`);
  };

  const topProjects = projects.filter(p => !p.parent_id);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar: logo + search + nav + phone */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-2 h-14 sm:h-16">

          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight shrink-0">
            <span className="text-primary font-extrabold text-base sm:text-lg leading-5">ChungCuGiaReHN.vn</span>
            <span className="text-gray-500 text-[10px] sm:text-xs font-medium">by Oanh Homes</span>
          </Link>

          {/* Search bar (desktop) */}
          <div ref={searchRef} className="hidden md:flex flex-1 mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full flex">
              <input
                type="text"
                value={searchQ}
                onChange={handleSearchChange}
                onFocus={() => searchQ.trim() && setSearchOpen(true)}
                placeholder="Tìm căn hộ... (vd: VP5 Linh Đàm, 2PN Đại Thanh)"
                className="w-full border border-gray-200 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit"
                className="bg-primary text-white px-4 rounded-r-full hover:bg-blue-800 transition-colors flex items-center">
                {searching
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                }
              </button>
            </form>
            {/* Search dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden z-50">
                {searchResults.map(apt => (
                  <Link key={apt.id} to={`/can-ho/${apt.id}`}
                    onClick={() => { setSearchOpen(false); setSearchQ(''); }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                    <img src={apt.image} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1">{apt.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{apt.project_name} · {apt.location}</p>
                      <p className="text-xs font-bold text-accent mt-0.5">{apt.price_display}</p>
                    </div>
                    {apt.listing_type === 'thue' && (
                      <span className="ml-auto shrink-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">CHO THUÊ</span>
                    )}
                  </Link>
                ))}
                <button
                  onClick={handleSearchSubmit}
                  className="w-full px-4 py-2.5 text-xs text-primary font-semibold hover:bg-primary hover:text-white transition-colors text-center">
                  Xem tất cả kết quả cho "{searchQ}"
                </button>
              </div>
            )}
            {searchOpen && searchQ.trim() && searchResults.length === 0 && !searching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-xl border border-gray-100 px-4 py-3 text-xs text-gray-500 z-50">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 shrink-0">
            {/* Mua căn hộ */}
            <div className="relative"
              onMouseEnter={() => setBuyOpen(true)}
              onMouseLeave={() => setBuyOpen(false)}>
              <Link to="/mua-can-ho"
                className="px-3 py-2 text-sm font-semibold flex items-center gap-1 hover:text-primary transition-colors text-gray-700 whitespace-nowrap">
                MUA CĂN HỘ
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              {buyOpen && topProjects.length > 0 && (
                <div className="absolute top-full left-0 bg-white shadow-2xl border border-gray-100 rounded-b-xl w-64 py-1 z-50">
                  <Link to="/mua-can-ho"
                    className="block px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:bg-gray-50">
                    Tất cả căn hộ
                  </Link>
                  {topProjects.map(proj => (
                    <div key={proj.slug}>
                      <Link to={`/du-an/${proj.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors group">
                        <span className="font-medium">{proj.name}</span>
                        {proj.children?.length > 0 && (
                          <svg className="w-3 h-3 opacity-50 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </Link>
                      {proj.children?.map(child => (
                        <Link key={child.slug} to={`/du-an/${child.slug}`}
                          className="flex items-center gap-2 pl-7 pr-4 py-2 text-xs text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary ml-4">
                          <span className="text-gray-300">↳</span>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cho thuê */}
            <Link to="/cho-thue-can-ho"
              className="px-3 py-2 text-sm font-semibold hover:text-primary transition-colors text-gray-700 whitespace-nowrap">
              CHO THUÊ
            </Link>

            <Link to="/lien-he"
              className="px-3 py-2 text-sm font-semibold hover:text-primary transition-colors text-gray-700 whitespace-nowrap">
              LIÊN HỆ
            </Link>
          </nav>

          {/* Phone (desktop) */}
          <a href="tel:0973883550"
            className="hidden lg:flex items-center gap-1.5 text-accent font-bold text-sm hover:opacity-80 shrink-0 ml-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="hidden xl:inline">0973 883 550</span>
          </a>

          {/* Mobile right icons */}
          <div className="flex items-center gap-1 ml-auto lg:hidden">
            <a href="tel:0973883550" className="p-2 text-accent">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <form onSubmit={(e) => { handleSearchSubmit(e); setMenuOpen(false); }} className="flex">
              <input
                type="text"
                value={searchQ}
                onChange={handleSearchChange}
                placeholder="Tìm căn hộ..."
                className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white px-3 rounded-r-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Mua căn hộ expandable */}
          <button
            onClick={() => setMobileBuyOpen(!mobileBuyOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold text-gray-800 hover:bg-gray-50 border-b border-gray-50">
            MUA CĂN HỘ
            <svg className={`w-4 h-4 transition-transform ${mobileBuyOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {mobileBuyOpen && (
            <div className="bg-gray-50 border-b border-gray-100">
              <Link to="/mua-can-ho" onClick={() => setMenuOpen(false)}
                className="block px-6 py-2.5 text-xs font-semibold text-primary">
                → Tất cả căn hộ mua
              </Link>
              {topProjects.map(proj => (
                <div key={proj.slug}>
                  <div className="flex items-center">
                    <Link to={`/du-an/${proj.slug}`} onClick={() => setMenuOpen(false)}
                      className="flex-1 px-6 py-2.5 text-sm text-gray-700 font-medium hover:text-primary">
                      {proj.name}
                    </Link>
                    {proj.children?.length > 0 && (
                      <button
                        onClick={() => setMobileSubOpen(mobileSubOpen === proj.slug ? null : proj.slug)}
                        className="px-3 py-2.5 text-gray-400 hover:text-primary">
                        <svg className={`w-4 h-4 transition-transform ${mobileSubOpen === proj.slug ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {mobileSubOpen === proj.slug && proj.children?.map(child => (
                    <Link key={child.slug} to={`/du-an/${child.slug}`} onClick={() => setMenuOpen(false)}
                      className="block pl-10 pr-6 py-2 text-xs text-gray-600 hover:text-primary border-l-2 border-primary ml-6 bg-blue-50/50">
                      ↳ {child.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}

          <Link to="/cho-thue-can-ho" onClick={() => setMenuOpen(false)}
            className="block px-4 py-3.5 text-sm font-bold text-gray-800 hover:bg-gray-50 border-b border-gray-50">
            CHO THUÊ CĂN HỘ
          </Link>
          <Link to="/lien-he" onClick={() => setMenuOpen(false)}
            className="block px-4 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-b border-gray-50">
            LIÊN HỆ
          </Link>
          <a href="tel:0973883550" className="block px-4 py-3.5 text-sm font-bold text-accent hover:bg-gray-50">
            📞 0973 883 550
          </a>
        </div>
      )}
    </header>
  );
}
