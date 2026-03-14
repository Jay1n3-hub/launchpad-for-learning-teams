import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrumGapSection from "@/components/ScrumGapSection";
import FeaturesSection from "@/components/FeaturesSection";
import ScrumEducationSection from "@/components/ScrumEducationSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import GettingStartedSection from "@/components/GettingStartedSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ScrumGapSection />
    <FeaturesSection />
    <ScrumEducationSection />
    <HowItWorksSection />
    <GettingStartedSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
