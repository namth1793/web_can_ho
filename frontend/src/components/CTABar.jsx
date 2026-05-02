export default function CTABar() {
  return (
    <section className="bg-navy py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-white font-extrabold text-xl md:text-2xl mb-1">
              TÌM CĂN HỘ PHÙ HỢP TRONG 24H
            </h2>
            <p className="text-white/70 text-sm">Gọi ngay để được tư vấn và xem nhà miễn phí</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="tel:0973123456"
              className="flex items-center gap-2 bg-accent text-white font-bold px-5 py-3 rounded-lg hover:bg-red-700 transition-colors text-sm shadow">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              GỌI NGAY 0973 123 456
            </a>
            <a href="https://zalo.me/0973123456" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 bg-blue-500 text-white font-bold px-5 py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm shadow">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              CHAT ZALO
            </a>
            <a href="tel:0973123456"
              className="flex items-center gap-2 bg-gold text-gray-900 font-bold px-5 py-3 rounded-lg hover:bg-yellow-500 transition-colors text-sm shadow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ĐẶT LỊCH XEM NHÀ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
