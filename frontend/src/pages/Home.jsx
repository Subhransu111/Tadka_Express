import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import PricingSection from "../components/PricingSection";
import MenuSection from "../components/MenuSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      
      <MenuSection />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;