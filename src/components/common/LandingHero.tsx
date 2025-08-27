import React from "react";
import Button from "../common/Button";

interface LandingHeroProps {
  onGetStarted: () => void;
  heroImage1: string;
  heroImage2: string;
  heroImage1Alt?: string;
  heroImage2Alt?: string;
}

const LandingHero: React.FC<LandingHeroProps> = ({
  onGetStarted,
  heroImage1,
  heroImage2,
  heroImage1Alt = "Professional service technician",
  heroImage2Alt = "Home service professional",
}) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-12 gap-8">
          <div className="lg:w-1/2 z-10 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-800 leading-tight">
              Welcome to <span className="text-blue-600">Fixify</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 mb-8 text-gray-600 leading-relaxed">
              One platform to find the best service professionals for your
              everyday needs.welcome to the world of the fixify and enjoy the
              services.
            </p>
            <Button
              onClick={onGetStarted}
              className="px-8 py-4 text-lg bg-black hover:bg-gray-800 transition-colors duration-300"
            >
              Get Started
            </Button>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative w-full h-[500px] lg:h-[600px]">
              <div className="absolute top-0 right-0 w-[280px] h-[320px] lg:w-[340px] lg:h-[380px] rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-300">
                <img
                  src={heroImage1}
                  alt={heroImage1Alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-[260px] h-[300px] lg:w-[320px] lg:h-[360px] rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:-rotate-1 transition-transform duration-300">
                <img
                  src={heroImage2}
                  alt={heroImage2Alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute top-1/2 left-0 w-24 h-24 bg-blue-50 rounded-full opacity-40 blur-lg"></div>
    </section>
  );
};

export default LandingHero;
