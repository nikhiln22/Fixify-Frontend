import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { VerificationBannerProps } from "../../types/component.types";
import Button from "../../components/common/Button";

export const VerificationBanner: React.FC<VerificationBannerProps> = ({
  isVerified,
  isSubmitted = false,
  onStartVerification,
}) => {
  if (isVerified) {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="bg-gray-100 border-l-4 border-green-500 p-4 mb-6 max-w-2xl mx-auto">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-md font-medium text-gray-800">
              Verification Submitted
            </h3>
            <div className="mt-2 text-sm text-gray-700">
              <p>
                Your qualifications have been submitted successfully. Our team
                will review your information and update your account status
                within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 border-l-4 border-black p-4 mb-6 max-w-2xl mx-auto">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-black" />
        </div>
        <div className="ml-3 flex-grow">
          <h3 className="text-md font-medium text-black">
            Account Verification Required
          </h3>
          <div className="mt-2 text-sm text-gray-700">
            <p>
              Your account is pending verification. Please complete your
              professional profile by submitting your qualifications to access
              all features of the Fixify platform.
            </p>
          </div>
        </div>
        <div className="ml-4">
          <Button
            onClick={onStartVerification}
            variant="primary"
            className="whitespace-nowrap"
          >
            Verify Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;
