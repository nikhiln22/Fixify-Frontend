import React, { useState, useEffect } from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { VerificationBanner } from "../../../components/technician/VerificationBanner";
import { QualificationForm } from "../../../components/technician/QualificationForm";
import Banner from "../../../components/common/Banner";
import Button from "../../../components/common/Button";
import {
  submitTechnicianQualification,
} from "../../../services/technician.services";
import { getTechnicianProfile } from "../../../services/common.services";
import { useDispatch } from "react-redux";
import { updateTechnicianData } from "../../../redux/slices/technicianslice";

export const TechnicianPortal: React.FC = () => {
  const dispatch = useDispatch();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showQualificationForm, setShowQualificationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicianProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getTechnicianProfile();
        console.log("technician profile in the technician portal page:", response);
        
        if (response) {
          const isVerifiedFromDB = response.is_verified || false;
          setIsVerified(isVerifiedFromDB);
          
          const hasQualifications = !!(
            response.yearsOfExperience ||
            response.Designation ||
            response.About ||
            response.image ||
            response.address ||
            (response.certificates && response.certificates.length > 0)
          );
          
          if (isVerifiedFromDB) {
            setIsSubmitted(false);
          } else if (hasQualifications) {
            setIsSubmitted(true);
          } else {
            setIsSubmitted(false);
          }
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
      if (formData.currentLocation) {
        data.append("address", formData.currentLocation.address || "");
        data.append(
          "latitude",
          formData.currentLocation.latitude?.toString() || ""
        );
        data.append(
          "longitude",
          formData.currentLocation.longitude?.toString() || ""
        );
      }
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
          address: response.technician.address,
          About: response.technician.About,
          image: response.technician.image,
          certificates: response.technician.certificates,
        };
        console.log("Dispatching updateTechnicianData with:", technicianData);
        dispatch(updateTechnicianData(technicianData));
        console.log("Dispatched updateTechnicianData");
        
        setIsSubmitted(true);
        setIsVerified(false);
      } else {
        console.log("No technician data in response or success is false");
      }

      setShowQualificationForm(false);
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting qualification:", error);
      return Promise.reject(error);
    }
  };

  const handleFormCancel = () => {
    setShowQualificationForm(false);
  };

  const handleViewAllBookings = () => {
    console.log("View all bookings clicked");
  };

  const handleTimeSlots = () => {
    console.log("Time slots clicked");
  };

  return (
    <TechnicianLayout>
      {isLoading && (
        <div className="flex flex-col items-center">
          <div className="my-4 text-center">
            <p>Loading your profile information...</p>
          </div>
        </div>
      )}

      {!isLoading && isVerified && (
        <>
          <Banner
            title="Welcome Back!"
            subtitle="Your account is verified and ready to receive bookings"
            backgroundColor="#10B981"
            height="400px"
            className="mb-8"
          />
          
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md space-y-4">
              <Button
                onClick={handleViewAllBookings}
                className="w-full"
                variant="primary"
              >
                View All Bookings
              </Button>
              
              <Button
                onClick={handleTimeSlots}
                className="w-full"
                variant="outline"
              >
                Time Slots
              </Button>
            </div>
          </div>
        </>
      )}

      {!isLoading && showQualificationForm && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-full">
            <QualificationForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {!isLoading && !isVerified && !showQualificationForm && (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center mb-12">
            Welcome to Technician Portal
          </h1>
          
          <VerificationBanner
            isVerified={isVerified}  
            isSubmitted={isSubmitted} 
            onStartVerification={handleStartVerification}
          />

          {!isSubmitted && (
            <div className="mt-8 text-center max-w-2xl">
              <p className="text-gray-700">
                Complete your verification to access all features of the
                technician portal.
              </p>
            </div>
          )}
        </div>
      )}
    </TechnicianLayout>
  );
};

export default TechnicianPortal;