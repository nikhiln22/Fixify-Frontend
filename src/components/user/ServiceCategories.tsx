import React from "react";
import {
  Wrench,
  Zap,
  Droplets,
  Paintbrush,
  Scissors,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
}

const ServiceCategories: React.FC = () => {
  const navigate = useNavigate();

  const serviceCategories: ServiceCategory[] = [
    {
      id: "cleaning",
      title: "Cleaning Services",
      description: "Professional cleaning and maintenance services",
      icon: <Scissors className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
      hoverColor: "hover:from-emerald-600 hover:to-teal-700",
    },
    {
      id: "painting",
      title: "Painting Services",
      description: "Interior and exterior painting solutions",
      icon: <Paintbrush className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
      hoverColor: "hover:from-orange-500 hover:to-red-600",
    },
    {
      id: "carpentry",
      title: "Carpentry Services",
      description: "Custom woodwork and furniture solutions",
      icon: <Wrench className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      hoverColor: "hover:from-amber-600 hover:to-orange-700",
    },
    {
      id: "ac",
      title: "AC Services",
      description: "Air conditioning repair and maintenance",
      icon: <Zap className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      hoverColor: "hover:from-blue-600 hover:to-indigo-700",
    },
    {
      id: "plumbing",
      title: "Plumbing Services",
      description: "Complete plumbing repair and installation",
      icon: <Droplets className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
      hoverColor: "hover:from-cyan-600 hover:to-blue-700",
    },
    {
      id: "electrical",
      title: "Electrical Services",
      description: "Safe and reliable electrical solutions",
      icon: <Zap className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
      hoverColor: "hover:from-yellow-500 hover:to-orange-600",
    },
  ];

  const handleCheckoutClick = () => {
    navigate("/user/categories");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative">
        <div className="text-left mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Our Services
            </h2>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {serviceCategories.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-12 translate-x-12 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

              <div
                className={`w-20 h-20 ${service.bgColor} ${service.hoverColor} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10`}
              >
                {service.icon}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {service.description}
              </p>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-colors duration-300"></div>
            </div>
          ))}

          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-8 text-white text-center flex flex-col justify-center relative overflow-hidden group hover:scale-105 transition-all duration-500 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-500">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">More service?</h3>
              <p className="text-sm mb-6 opacity-90 leading-relaxed">
                You can tell us what you need and we can help!
              </p>
              <Button
                onClick={handleCheckoutClick}
                variant="outline"
                className="bg-white text-purple-700 border-white hover:bg-purple-50 hover:border-purple-100 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Check Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
