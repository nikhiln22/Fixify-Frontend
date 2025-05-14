import React, { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

export const ApplicantDetailsPreview: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const navigate = useNavigate();

  const applicant = {
    _id: "6819e4abcd333edc1639d11d",
    username: "Bruce Wayne",
    email: "bruce@gmail.com",
    phone: "9845397500",
    is_verified: false,
    certificates: [
      "https://res.cloudinary.com/dv3oqdsdb/image/upload/v1746527487/fixify/certificate1.jpg",
      "https://res.cloudinary.com/dv3oqdsdb/image/upload/v1746527487/fixify/certificate2.jpg",
    ],
    createdAt: "2025-05-06T10:30:03.229+00:00",
    updatedAt: "2025-05-06T10:31:29.520+00:00",
    About: "I'm an highly qualified professional plumber",
    Designation: "Plumber",
    city: "Bangalore",
    image: "/api/placeholder/120/120",
    preferredWorkLocation: "Whitefield",
    yearsOfExperience: 4,
  };

  const handleApprove = () => {
    alert("Technician approved successfully!");
  };

  const handleReject = () => {
    alert("Technician application rejected!");
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Technician Application Details</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-6 text-center">
                <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full overflow-hidden mb-4">
                  <img
                    src={applicant.image}
                    alt={applicant.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{applicant.username}</h2>
                <p className="text-gray-600">{applicant.Designation}</p>
              </div>

              <div className="border-t px-6 py-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{applicant.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{applicant.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p>{applicant.yearsOfExperience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p>{applicant.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Preferred Location</p>
                    <p>{applicant.preferredWorkLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Application Date</p>
                    <p>{new Date(applicant.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-700">{applicant.About}</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Certificates</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {applicant.certificates.map((cert, index) => (
                    <div
                      key={index}
                      className="border rounded overflow-hidden cursor-pointer hover:shadow-md transition"
                      onClick={() => setSelectedCertificate(cert)}
                    >
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h4 className="font-medium">Certificate {index + 1}</h4>
                      </div>
                      <div className="p-4 h-32 flex items-center justify-center bg-gray-100">
                        <img
                          src="/api/placeholder/150/100"
                          alt={`Certificate ${index + 1}`}
                          className="max-h-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Verification</h3>
              </div>
              <div className="p-6">
                <div className="mb-4 flex">
                  <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                    Pending Verification
                  </span>
                </div>

                <p className="mb-6 text-gray-700">
                  Review all certificates and information before approving or rejecting this
                  technician's application. Approved technicians will be able to receive
                  service requests.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleApprove}
                    className="px-4 py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
                  >
                    Approve Technician
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-3 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="font-bold">Certificate Preview</h3>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <img
                  src="/api/placeholder/800/600"
                  alt="Certificate"
                  className="max-w-full h-auto mx-auto"
                />
              </div>
              <div className="px-6 py-4 border-t flex justify-end">
                <a
                  href={selectedCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                  Open in New Tab
                </a>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};