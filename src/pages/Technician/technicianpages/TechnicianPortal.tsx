import React, { useState, useEffect } from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { VerificationBanner } from "../../../components/technician/VerificationBanner";
import { QualificationForm } from "../../../components/technician/QualificationForm";
import {
  submitTechnicianQualification,
  getTechnicianProfile,
} from "../../../services/technician.services";
import { useDispatch } from "react-redux";
import { updateTechnicianData } from "../../../redux/slices/technicianslice";

export const TechnicianPortal: React.FC = () => {
  const dispatch = useDispatch();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showQualificationForm, setShowQualificationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicianProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getTechnicianProfile();
        console.log("response from the technician profile:", response);
        if (response.success && response.technician) {
          const hasQualifications = !!(
            response.technician.yearsOfExperience ||
            response.technician.Designation ||
            response.technician.About ||
            response.technician.image ||
            response.technician.city ||
            response.technician.preferredWorkLocation ||
            (response.technician.certificates &&
              response.technician.certificates.length > 0)
          );

          setIsSubmitted(hasQualifications);
        }
      } catch (error) {
        console.error("Error fetching technician profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnicianProfile();
  }, []);

  const handleStartVerification = () => {
    setShowQualificationForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    console.log("Form submitted with data:", formData);
    try {
      const data = new FormData();
      data.append("experience", formData.experience);
      data.append("designation", formData.designation);
      data.append("about", formData.about);
      data.append("city", formData.city);
      data.append("preferredWorkLocation", formData.preferredWorkLocation);
      if (formData.profilePhoto) {
        data.append("profilePhoto", formData.profilePhoto);
      }
      if (formData.certificates && formData.certificates.length > 0) {
        formData.certificates.forEach((certificate: File) => {
          data.append("certificates", certificate);
        });
      }
      const response = await submitTechnicianQualification(data);
      console.log("response from the technician portal:", response);

      if (response.success && response.technician) {
        const technicianData = {
          yearsOfExperience: response.technician.yearsOfExperience,
          Designation: response.technician.Designation,
          city: response.technician.city,
          preferredWorkLocation: response.technician.preferredWorkLocation,
          About: response.technician.About,
          image: response.technician.image,
          certificates: response.technician.certificates,
        };
        console.log("Dispatching updateTechnicianData with:", technicianData);
        dispatch(updateTechnicianData(technicianData));
        console.log("Dispatched updateTechnicianData");
      } else {
        console.log("No technician data in response or success is false");
      }

      setShowQualificationForm(false);
      setIsSubmitted(true);
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting qualification:", error);
      return Promise.reject(error);
    }
  };

  const handleFormCancel = () => {
    setShowQualificationForm(false);
  };

  return (
    <TechnicianLayout>
      <div className="flex flex-col items-center p-4 mt-8">
        <h1 className="text-3xl font-bold text-center mb-12">
          Welcome to Technician Portal
        </h1>

        {!isLoading && !showQualificationForm && (
          <VerificationBanner
            isVerified={false}
            isSubmitted={isSubmitted}
            onStartVerification={handleStartVerification}
          />
        )}

        {isLoading && (
          <div className="my-4 text-center">
            <p>Loading your profile information...</p>
          </div>
        )}

        {showQualificationForm && (
          <div className="w-full max-w-full">
            <QualificationForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {!isLoading && !showQualificationForm && !isSubmitted && (
          <div className="mt-8 text-center max-w-2xl">
            <p className="text-gray-700">
              Complete your verification to access all features of the
              technician portal.
            </p>
          </div>
        )}
      </div>
    </TechnicianLayout>
  );
};

export default TechnicianPortal;
