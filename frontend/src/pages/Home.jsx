import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LeadForm from '../components/LeadForm';
import FeaturedApartments from '../components/FeaturedApartments';
import AreaSection from '../components/AreaSection';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import CTABar from '../components/CTABar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <LeadForm />
      <FeaturedApartments />
      <AreaSection />
      <WhyChooseUs />
      <Testimonials />
      <CTABar />
      <Footer />
      <FloatingButtons />
    </div>
  );
}
