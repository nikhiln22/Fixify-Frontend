import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

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

  const cardVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300/70 to-gray-700/70"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-background.jpg')",
            filter: "brightness(0.4) grayscale(0.7)",
            zIndex: -1,
          }}
        ></div>

        <div className="z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Welcome to <span className="text-gray-300">Fixify</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-white">
            One platform to find the best service professionals for your everyday needs.
          </p>
          <Button
            onClick={handleGetStarted}
            className="px-8 py-4 text-lg bg-black"
          >
            Get Started
          </Button>
        </div>
      </section>

      <Modal isopen={isModalOpen} onclose={closeModal}>
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* User Login Card */}
          <motion.div
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            className="flex-1 bg-white p-6 rounded-xl shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                👤
              </div>
              <h3 className="text-2xl font-semibold mb-2">Login as User</h3>
              <p className="text-gray-600 mb-4">Find and book services for your home</p>
              <Button
                onClick={() => (window.location.href = "/user/login")}
                className="w-full py-3 bg-gray-700 text-white hover:bg-gray-600"
              >
                Login as User
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            className="flex-1 bg-white p-6 rounded-xl shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                🛠️
              </div>
              <h3 className="text-2xl font-semibold mb-2">Login as Technician</h3>
              <p className="text-gray-600 mb-4">Offer your services and grow your business</p>
              <Button
                onClick={() => (window.location.href = "/technician/login")}
                className="w-full py-3 bg-gray-700 text-white hover:bg-gray-600"
              >
                Login as Technician
              </Button>
            </div>
          </motion.div>
        </div>
      </Modal>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div
            className={`transition-all duration-1000 ${
              isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl font-bold text-left mb-10 text-gray-800">
              Why Fixify?
            </h2>

            <div className="mb-10">
              <p className="text-xl text-gray-600 max-w-3xl">
                At Fixify, we're committed to providing the best service experience.
                Whether you need a quick fix or a major project, our platform connects you
                with reliable professionals for all your service needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {[
                {
                  title: "Verified Professionals",
                  description:
                    "All our service providers undergo rigorous background checks and training to ensure you receive reliable and professional service every time.",
                  icon: "🛡️",
                },
                {
                  title: "Seamless Booking",
                  description:
                    "Book services with just a few clicks, choose your preferred time slots, and track job progress in real-time through our intuitive platform.",
                  icon: "📅",
                },
                {
                  title: "24/7 Support",
                  description:
                    "Our dedicated customer service team is always available to assist you before, during, and after your service for complete peace of mind.",
                  icon: "🔧",
                },
                {
                  title: "Transparent Pricing",
                  description:
                    "Know exactly what you'll pay upfront with no hidden fees or surprises. Compare rates from different service providers before booking.",
                  icon: "💰",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};