import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center min-h-[480px] py-8 gap-8">
          {/* Left content */}
          <div className="flex-1 lg:py-12">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black leading-tight mb-4">
              <span className="text-primary block">CHUNG CƯ HÀ NỘI</span>
              <span className="text-accent block">GIÁ RẺ</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              CẬP NHẬT CĂN ĐẸP MỖI NGÀY
            </p>
            <p className="text-gray-500 text-base mb-8">
              Giá thật – Sổ đỏ – Hỗ trợ vay ngân hàng
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/chung-cu-ha-noi"
                className="bg-accent text-white font-bold px-7 py-3.5 rounded flex items-center gap-2 hover:bg-red-700 transition-colors text-sm md:text-base shadow-lg">
                XEM CĂN HOT NGAY
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a href="tel:0973123456"
                className="border-2 border-primary text-primary font-bold px-7 py-3.5 rounded flex items-center gap-2 hover:bg-primary hover:text-white transition-colors text-sm md:text-base">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                NHẬN TƯ VẤN MIỄN PHÍ
              </a>
            </div>
          </div>

          {/* Right image */}
          <div className="flex-1 w-full lg:max-w-xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85"
                alt="Chung cư Hà Nội giá rẻ"
                className="w-full h-72 md:h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow">
                <p className="text-xs text-gray-500 font-medium">Giá tốt nhất thị trường</p>
                <p className="text-primary font-extrabold text-lg leading-tight">Từ 1.8 Tỷ đồng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
