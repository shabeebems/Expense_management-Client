import Benefits from "../Components/Entrance/Benefits";
import CallToAction from "../Components/Entrance/CallToAction";
import Features from "../Components/Entrance/features";
import Footer from "../Components/Entrance/Footer";
import Hero from "../Components/Entrance/hero";
import HowItWorks from "../Components/Entrance/HowItWorks";
import Statistics from "../Components/Entrance/Statistics";
import Testimonials from "../Components/Entrance/Testimonials";
import TrustedBy from "../Components/Entrance/TrustedBy";

const EntrancePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Statistics />
      <Benefits />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>

  );
};

export default EntrancePage;
