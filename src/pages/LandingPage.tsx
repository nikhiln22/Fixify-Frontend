import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/common/Button";
import { X } from "lucide-react";

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

  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
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
            One platform to find the best service professionals for your
            everyday needs.
          </p>
          <Button
            onClick={handleGetStarted}
            className="px-8 py-4 text-lg bg-black"
          >
            Get Started
          </Button>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeModal}
            />
            
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative flex flex-col md:flex-row gap-8 px-4">
                <button 
                  onClick={closeModal}
                  className="absolute -top-8 -right-8 p-2 z-10 transition-transform hover:scale-110"
                  aria-label="Close modal"
                >
                  <X size={32} className="text-black" strokeWidth={2.5} />
                </button>
                
                <motion.div
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="relative overflow-hidden"
                  style={{ 
                    width: '440px', 
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(to top, #9ca3af, #e5e7eb)'
                  }}
                >
                  <div className="p-14 text-center">
                    <div className="flex justify-center items-center w-40 h-40 bg-gray-200 rounded-full mx-auto mb-10" 
                      style={{ boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)' }}>
                      <span className="text-gray-900 text-6xl">&#x1F464;</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 text-gray-800">Login as User</h3>
                    <p className="text-xl text-gray-600 mb-10">
                      Find and book services for your home
                    </p>
                    
                    <Button
                      onClick={() => (window.location.href = "/user/login")}
                      className="w-full py-6 bg-black hover:bg-gray-800 text-xl font-semibold rounded-xl text-white"
                      style={{ 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)' 
                      }}
                    >
                      Login as User
                    </Button>
                    
                    <p className="mt-8 text-gray-600">
                      Not registered? <a href="/user/register" className="text-gray-800 hover:underline font-medium">Create an account</a>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="relative overflow-hidden"
                  style={{ 
                    width: '440px', 
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(to top, #9ca3af, #e5e7eb)'
                  }}
                >
                  <div className="p-14 text-center">
                    <div className="flex justify-center items-center w-40 h-40 bg-gray-200 rounded-full mx-auto mb-10" 
                      style={{ boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)' }}>
                      <span className="text-gray-900 text-6xl">&#x1F6E0;</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 text-gray-800">
                      Login as Technician
                    </h3>
                    <p className="text-xl text-gray-600 mb-10">
                      Offer your services and grow your business
                    </p>
                    
                    <Button
                      onClick={() => (window.location.href = "/technician/login")}
                      className="w-full py-6 bg-black hover:bg-gray-800 text-xl font-semibold rounded-xl text-white"
                      style={{ 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)' 
                      }}
                    >
                      Login as Technician
                    </Button>
                    
                    <p className="mt-8 text-gray-600">
                      Not registered? <a href="/technician/register" className="text-gray-800 hover:underline font-medium">Join as a technician</a>
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div
            className={`transition-all duration-1000 ${
              isScrolled
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl font-bold text-left mb-10 text-gray-800">
              Why Fixify?
            </h2>

            <div className="mb-10">
              <p className="text-xl text-gray-600 max-w-3xl">
                At Fixify, we're committed to providing the best service
                experience. Whether you need a quick fix or a major project, our
                platform connects you with reliable professionals for all your
                service needs.
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