import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <p className="font-extrabold text-lg text-white">ChungCuGiaReHN.vn</p>
              <p className="text-white/60 text-xs">by Oanh Homes</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Chuyên phân phối chung cư giá rẻ tại Hà Nội. Giá thật – Nhà thật – Hỗ trợ tận tâm.
            </p>
            <div className="flex gap-3">
              {['facebook', 'youtube', 'tiktok'].map(s => (
                <a key={s} href="#"
                  className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-primary transition-colors text-xs font-bold">
                  {s === 'facebook' ? 'f' : s === 'youtube' ? 'Y' : 'T'}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4 text-white/90 tracking-wide">LIÊN HỆ</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:0973883550" className="hover:text-gold transition-colors">0973 883 550</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                chungcugiarehn@gmail.com
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Hoàng Mai, Hà Nội
              </li>
            </ul>
          </div>

          {/* Danh mục */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4 text-white/90 tracking-wide">DANH MỤC</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/mua-can-ho" className="hover:text-gold transition-colors">Mua căn hộ</Link></li>
              <li><Link to="/cho-thue-can-ho" className="hover:text-gold transition-colors">Cho thuê căn hộ</Link></li>
              <li><Link to="/du-an/dai-thanh" className="hover:text-gold transition-colors">Chung cư Đại Thanh</Link></li>
              <li><Link to="/du-an/linh-dam" className="hover:text-gold transition-colors">KĐT Linh Đàm</Link></li>
              <li><Link to="/du-an/kim-van-kim-lu" className="hover:text-gold transition-colors">Kim Văn – Kim Lũ</Link></li>
              <li><Link to="/lien-he" className="hover:text-gold transition-colors">Liên hệ tư vấn</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4 text-white/90 tracking-wide">HỖ TRỢ</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/lien-he" className="hover:text-gold transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/lien-he" className="hover:text-gold transition-colors">Tin tức</Link></li>
              <li><Link to="/lien-he" className="hover:text-gold transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/lien-he" className="hover:text-gold transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-3.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2024 ChungCuGiaReHN.vn – All rights reserved.
          </p>
          <Link to="/admin"
            className="text-white/20 hover:text-white/50 text-xs transition-colors select-none">
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
