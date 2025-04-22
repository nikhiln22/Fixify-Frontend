import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export const TechnicianFooter:React.FC = () => {
  return (
    <footer className="bg-gray-300 text-gray-800">
      <div className="container mx-auto px-6 pt-8 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-400 pb-6">
          <div className="mb-5 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">FIXIFY</h2>
            <p className="text-gray-600 italic">Fix it if you Deserve</p>
          </div>
          
          <div className="w-full md:w-1/3">
            <h3 className="text-base font-semibold mb-3">Subscribe to our newsletter</h3>
            <div className="flex shadow-md">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-3 py-2 rounded-l-md w-full bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800"
              />
              <button className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-r-md transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="text-base font-semibold mb-3 border-b border-gray-500 pb-2 inline-block">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Our Team</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Careers</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3 border-b border-gray-500 pb-2 inline-block">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Plumbing</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Electrical</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">House Cleaning</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Painting</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">All Services</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3 border-b border-gray-500 pb-2 inline-block">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Help Center</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Contact Us</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">FAQs</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition duration-300">Service Guarantee</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3 border-b border-gray-500 pb-2 inline-block">Get in Touch</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-black mt-0.5" />
                <span className="text-gray-700">123 Main Street, City State, Country</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-black" />
                <span className="text-gray-700">1234-567-890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-black" />
                <span className="text-gray-700">info@fixify.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Fixify. All rights reserved.</p>
          <div className="flex justify-center mt-3 space-x-6">
            <a href="#" className="text-gray-600 hover:text-black transition duration-300">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-black transition duration-300">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-black transition duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};