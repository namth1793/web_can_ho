import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RefreshProvider } from './contexts/RefreshContext';
import Home from './pages/Home';
import ApartmentList from './pages/ApartmentList';
import ProjectPage from './pages/ProjectPage';
import ApartmentDetail from './pages/ApartmentDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <RefreshProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mua-can-ho" element={<ApartmentList listingType="ban" title="Mua Căn Hộ Hà Nội" />} />
        <Route path="/cho-thue-can-ho" element={<ApartmentList listingType="thue" title="Cho Thuê Căn Hộ Hà Nội" />} />
        <Route path="/du-an/:slug" element={<ProjectPage />} />
        <Route path="/tim-kiem" element={<ApartmentList title="Kết Quả Tìm Kiếm" />} />
        <Route path="/can-ho/:id" element={<ApartmentDetail />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        {/* Legacy redirects */}
        <Route path="/chung-cu-ha-noi" element={<ApartmentList listingType="ban" title="Chung Cư Hà Nội" />} />
      </Routes>
    </BrowserRouter>
    </RefreshProvider>
  );
}
