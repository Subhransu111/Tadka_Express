import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import PriceSection from "../components/PricingSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <PriceSection />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;