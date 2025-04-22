import React, { useState } from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { VerificationBanner } from "../../../components/technician/VerificationBanner";
import { QualificationForm } from "../../../components/technician/QualificationForm";
import { submitTechnicianQualification } from "../../../services/technician.services";

export const TechnicianPortal: React.FC = () => {

  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [showQualificationForm, setShowQualificationForm] = useState(false);

  
  const handleStartVerification = () => {
    setShowQualificationForm(true);
  };



  const handleFormSubmit = async (formData: any) => {
    console.log("Form submitted with data:", formData);
    
    try {

      const data = new FormData();
  
      data.append('experience', formData.experience);
      data.append('designation', formData.designation);
      data.append('about', formData.about);
      
      if (formData.profilePhoto) {
        data.append('profilePhoto', formData.profilePhoto);
      }
      
      if (formData.certificates && formData.certificates.length > 0) {
        formData.certificates.forEach((certificate: File) => {
          data.append('certificates', certificate);
        });
      }
      
      let result = await submitTechnicianQualification(data);

      console.log("result from the technician portal:",result);
      
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
    <TechnicianLayout isVerified={isVerified}>
      <div className="flex flex-col items-center p-4 mt-8">
        <h1 className="text-3xl font-bold text-center mb-12">
          Welcome to Technician Portal
        </h1>

        {!showQualificationForm && (
          <VerificationBanner
            isVerified={isVerified}
            isSubmitted={isSubmitted}
            onStartVerification={handleStartVerification}
          />
        )}

        {showQualificationForm && (
          <div className="w-full max-w-3xl">
            <QualificationForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {!showQualificationForm &&
          (isVerified ? (
            <div className="mt-8 text-center max-w-2xl">
              <p className="text-gray-700">
                Your account is fully verified. You have access to all
                technician features.
              </p>
            </div>
          ) : (
            <div className="mt-8 text-center max-w-2xl">
              <p className="text-gray-700">
                Complete your verification to access all features of the
                technician portal.
              </p>
            </div>
          ))}
      </div>
    </TechnicianLayout>
  );
};

export default TechnicianPortal;