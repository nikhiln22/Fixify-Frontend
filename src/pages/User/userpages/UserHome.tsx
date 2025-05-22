import React from "react";
import UserLayout from "../../../layouts/UserLayout";
import {
  Users,
  Wrench,
  Paintbrush,
  CheckCircle,
  PlugZap,
  Waves,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import heroImage from "../../../assets/images/hero-image.png";
import plumberImage from "../../../assets/images/plumber.jpg";
import housepainters from "../../../assets/images/house-painters.jpg";
import acInstallation from "../../../assets/images/Ac installation home.jpg";
import technicianImage from "../../../assets/images/technician.jpg";


export const UserHome: React.FC = () => {
  return (
    <UserLayout>
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2 z-10">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Home Services at your Door Step
              </h1>
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium">
                Book Now
              </button>
            </div>
            <div className="md:w-1/2 h-auto">
              <div className="h-64 md:h-80">
                <img
                  src={heroImage}
                  alt="Service professionals"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <h2 className="text-lg font-medium mb-6">
            What you are looking for ?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              {
                title: "AC & Electrical Work",
                icon: <PlugZap className="h-6 w-6" />,
              },
              {
                title: "Cleaning & Pest Control",
                icon: <Users className="h-6 w-6" />,
              },
              {
                title: "Plumbing & Pipes",
                icon: <Waves className="h-6 w-6" />,
              },
              {
                title: "Painting & Decor",
                icon: <Paintbrush className="h-6 w-6" />,
              },
              {
                title: "Repairs & Services",
                icon: <Wrench className="h-6 w-6" />,
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-md shadow-sm hover:shadow-md transition overflow-hidden text-center p-4"
              >
                <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  {service.icon}
                </div>
                <p className="text-xs text-gray-800">{service.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <h2 className="text-2xl font-bold mb-6">Most Booked services</h2>
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { title: "Minor Plumbing Repair", image: plumberImage },
                { title: "AC & Appliance installation", image: acInstallation },
                { title: "Full House Painting", image: housepainters },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto w-full"
                >
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium text-gray-800">
                      {service.title}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm font-medium">
                        {index === 0 ? "4.79" : index === 1 ? "4.81" : "4.80"}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        {index === 0
                          ? "(103K)"
                          : index === 1
                            ? "(3K)"
                            : "(31K)"}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 mt-1">
                      {index === 0 ? "₹1,098" : index === 1 ? "₹49" : "₹1,498"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute inset-y-0 left-0 flex items-center -ml-3">
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 focus:outline-none">
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center -mr-3">
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 focus:outline-none">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-lg overflow-hidden shadow-2xl">
            <div className="md:w-2/5">
              <div className="h-full w-full relative">
                <img
                  src={technicianImage}
                  alt="Professional plumber"
                  className="w-full h-full object-cover"
                />

                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <div className="bg-black text-white rounded-full p-3 shadow-md">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-3/5 p-8">
              <h2 className="text-2xl font-bold mb-8">
                How HomeService works?
              </h2>

              <div className="space-y-8">
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center font-bold text-gray-800">
                      1.
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      Book Us Anytime
                    </h3>
                    <p className="text-sm text-gray-600">
                      You can contact us directly, we will pick-up your call to
                      start with our home service procedure and we are ready
                      anytime
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center font-bold text-gray-800">
                      2.
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      Schedule Service
                    </h3>
                    <p className="text-sm text-gray-600">
                      After connecting your call, our home care experts will
                      answer your questions and provide flexible appointment
                      times
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center font-bold text-gray-800">
                      3.
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      Your request is completed
                    </h3>
                    <p className="text-sm text-gray-600">
                      Once your service is confirmed, we'll send the problem
                      solution at your home. If you can't be at the location,
                      the technician will get to work
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
};
