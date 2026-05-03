import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ApartmentList from './pages/ApartmentList';
import ApartmentDetail from './pages/ApartmentDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chung-cu-ha-noi" element={<ApartmentList />} />
        <Route path="/dai-thanh" element={<ApartmentList area="dai-thanh" title="Chung Cư Đại Thanh" />} />
        <Route path="/linh-dam" element={<ApartmentList area="linh-dam" title="Chung Cư Linh Đàm" />} />
        <Route path="/kim-van-kim-lu" element={<ApartmentList area="kim-van-kim-lu" title="Kim Văn – Kim Lú" />} />
        <Route path="/can-ho/:id" element={<ApartmentDetail />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
