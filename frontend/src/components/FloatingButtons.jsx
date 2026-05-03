export default function FloatingButtons() {
  return (
    <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-3">
      {/* Call button */}
      <a href="tel:0973883550"
        className="flex flex-col items-center bg-accent text-white rounded-full w-14 h-14 shadow-lg hover:bg-red-700 transition-colors group"
        title="Gọi ngay">
        <div className="flex items-center justify-center flex-1">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </div>
        <span className="text-[9px] font-bold pb-1.5 -mt-1">Gọi ngay</span>
      </a>

      {/* Zalo button */}
      <a href="https://zalo.me/0973883550" target="_blank" rel="noreferrer"
        className="flex flex-col items-center bg-blue-500 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-600 transition-colors"
        title="Chat Zalo">
        <div className="flex items-center justify-center flex-1">
          <span className="font-black text-sm">Zalo</span>
        </div>
        <span className="text-[9px] font-bold pb-1.5 -mt-1">Zalo</span>
      </a>
    </div>
  );
}
