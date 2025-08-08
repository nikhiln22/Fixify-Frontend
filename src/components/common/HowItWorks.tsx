import React from "react";
import { CheckCircle } from "lucide-react";


interface HowItWorksProps {
  technicianImage: string;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ technicianImage }) => {
  const steps = [
    {
      number: "1.",
      title: "Book Us Anytime",
      description:
        "You can contact us directly, we will pick-up your call to start with our home service procedure and we are ready anytime",
    },
    {
      number: "2.",
      title: "Schedule Service",
      description:
        "After connecting your call, our home care experts will answer your questions and provide flexible appointment times",
    },
    {
      number: "3.",
      title: "Your request is completed",
      description:
        "Once your service is confirmed, we'll send the problem solution at your home. If you can't be at the location, the technician will get to work",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 max-w-7xl w-full">
        <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-lg overflow-hidden shadow-2xl">
          <div className="md:w-2/5">
            <div className="h-full w-full relative">
              <img
                src={technicianImage}
                alt="Professional technician"
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
            <h2 className="text-2xl font-bold mb-8">How Fixify works?</h2>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center font-bold text-gray-800">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;