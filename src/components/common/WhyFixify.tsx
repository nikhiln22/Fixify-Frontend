import React from "react";

interface WhyFixifyProps {
  isScrolled: boolean;
}

const WhyFixify: React.FC<WhyFixifyProps> = ({ isScrolled }) => {
  const features = [
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
  ];

  return (
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
            {features.map((feature, index) => (
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
  );
};

export default WhyFixify;