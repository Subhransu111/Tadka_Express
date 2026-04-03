import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Aboutus from "../components/Aboutus";
import HowItWorks from "../components/HowItWorks";
import PricingSection from "../components/PricingSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import LocationGuard from "../components/LocationGuard";
import BannerSlider from "../components/BannerSlider";
function Home() {
  return (
    <div>
      <LocationGuard />
      <Navbar />
      <Hero />
      <BannerSlider />
      <HowItWorks />
      <PricingSection />
      <Aboutus />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Home;