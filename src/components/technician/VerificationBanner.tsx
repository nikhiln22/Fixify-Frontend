import React from "react";
import { AlertTriangle, CheckCircle, FileEdit, ArrowRight, Clock } from "lucide-react";
import { VerificationBannerProps } from "../../types/component.types";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

export const VerificationBanner: React.FC<VerificationBannerProps> = ({
  isVerified,
  isSubmitted = false,
  onStartVerification,
}) => {
  const navigate = useNavigate();

  if (isVerified) {
    return null;
  }

  const handleNavigateToProfile = () => {
    navigate('/technician/profile');
  };

  if (isSubmitted) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-lg shadow-sm p-6 mb-6 max-w-3xl mx-auto animate-in slide-in-from-top duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Verification Submitted Successfully
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Pending Review
              </span>
            </div>
            <div className="mt-3 space-y-4">
              <div className="bg-white/60 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-gray-700">
                    Our team will review your information and update your account status within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileEdit className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-600">
                  Need to make changes? Visit your{" "}
                  <button 
                    onClick={handleNavigateToProfile}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline transition-colors"
                  >
                    profile section
                    <ArrowRight className="h-3 w-3" />
                  </button>{" "}
                  to edit your qualification details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-yellow-500 rounded-r-lg shadow-sm p-6 mb-6 max-w-3xl mx-auto animate-in slide-in-from-top duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center border-2 border-yellow-200">
            <AlertTriangle className="h-7 w-7 text-yellow-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Complete Your Professional Verification
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Unlock full access to the Fixify platform
              </p>
            </div>
            <Button
              onClick={onStartVerification}
              variant="primary"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Verify Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 bg-white/70 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700">
              Submit your professional qualifications to get verified and access all features of the platform. The verification process usually takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;