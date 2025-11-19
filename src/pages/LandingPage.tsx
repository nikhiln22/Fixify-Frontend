import React, { useState, useEffect } from "react";
import LandingHero from "../components/common/LandingHero";
import LoginModal from "../components/common/LoginModal";
import WhyFixify from "../components/common/WhyFixify";
import HowItWorks from "../components/common/HowItWorks";
import technicianImage from "../assets/images/technician.jpg";
import capenterHero from "../assets/images/carpenter.jpg";
import plumberHero from "../assets/images/plumber.jpg";

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleGetStarted = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800">
      <LandingHero
        onGetStarted={handleGetStarted}
        heroImage1={plumberHero}
        heroImage2={capenterHero}
        heroImage1Alt="Professional door repair and lock installation service"
        heroImage2Alt="Expert plumbing repair and maintenance service"
      />

      <LoginModal isOpen={isModalOpen} onClose={closeModal} />

      <WhyFixify isScrolled={isScrolled} />

      <HowItWorks technicianImage={technicianImage} />
    </div>
  );
};
