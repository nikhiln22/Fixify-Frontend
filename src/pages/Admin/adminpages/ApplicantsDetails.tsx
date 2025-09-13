import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import { Itechnician } from "../../../models/technician";
import { ProfileCard } from "../../../components/common/ProfileCard";
import { TechnicianAboutSection } from "../../../components/technician/AboutSection";
import { TechnicianCertificatesSection } from "../../../components/technician/CertificateSection";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import {
  applicantDetails,
  approveApplicant,
  rejectApplicant,
} from "../../../services/applicantService";
import { showToast } from "../../../utils/toast";
import { buildCloudinaryUrl } from "../../../utils/cloudinary/cloudinary";
import { IAddress } from "../../../models/address";

export const ApplicantDetails: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null
  );
  const [applicant, setApplicant] = useState<Itechnician | null>(null);
  const [applicantAddress, setApplicantAddress] = useState<IAddress[]>([]);

  const navigate = useNavigate();
  const { applicantId } = useParams<{ applicantId: string }>();

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      if (!applicantId) {
        return;
      }

      try {
        const response = await applicantDetails(applicantId);
        console.log(
          "response from the applicant details preview page:",
          response
        );
        if (response.success && response.data) {
          setApplicant(response.data);
          setApplicantAddress(response.data.addresses || []);
        }
      } catch (err) {
        console.error("Error fetching applicant details:", err);
        showToast({
          message: "Failed to load applicant details",
          type: "error",
        });
      }
    };

    fetchApplicantDetails();
  }, [applicantId]);

  const handleApprove = async () => {
    if (!applicantId) return;

    try {
      await approveApplicant(applicantId);
      showToast({
        message: "Technician approved successfully",
        type: "success",
      });
      navigate("/admin/technicians");
    } catch (error) {
      console.error("Error approving technician:", error);
      showToast({
        message: "Failed to approve Technician",
        type: "error",
      });
    }
  };

  const handleReject = async () => {
    if (!applicantId) return;

    try {
      await rejectApplicant(applicantId);
      showToast({
        message: "Applicant application rejected",
        type: "success",
      });
      navigate("/admin/applicantslist");
    } catch (error) {
      console.error("Error rejecting technician:", error);
      showToast({
        message: "Failed to reject applicant",
        type: "error",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!applicant) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen bg-gray-50 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applicant details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Applicant Details
          </h1>
          <Button onClick={handleBack} variant="outline" className="px-6 py-2">
            Back
          </Button>
        </div>

        <ProfileCard
          name={applicant.username}
          email={applicant.email}
          phone={applicant.phone}
          image={
            applicant.image
              ? buildCloudinaryUrl(applicant.image)
              : "/default-profile.jpg"
          }
          role="technician"
          Designation={applicant.Designation?.designation}
          yearsOfExperience={applicant.yearsOfExperience}
          isEditable={false}
          onSave={() => {}}
        />

        <TechnicianAboutSection
          initialAbout={applicant.About}
          onSave={async () => {}}
          isLoading={false}
          isEditable={false}
        />

        <TechnicianCertificatesSection
          certificates={applicant.certificates?.map((cert) =>
            buildCloudinaryUrl(cert)
          )}
          onCertificatesUpdate={async () => {}}
          isLoading={false}
          isEditable={false}
        />

        <div className="bg-white rounded-3xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Work Locations
          </h2>

          {applicantAddress && applicantAddress.length > 0 ? (
            <div className="space-y-4">
              {applicantAddress.map((address, index) => (
                <div
                  key={address._id || index}
                  className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Service Area{" "}
                      {applicantAddress.length > 1 ? `${index + 1}` : ""}
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      {address.fullAddress || "Address not specified"}
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Coverage Area:</span> This
                        technician can accept service requests within 10 km
                        radius from this location
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Service Area
                </h4>
                <p className="text-gray-500 leading-relaxed mb-3">
                  This applicant has not specified any work locations yet.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note:</span> This applicant
                    has not added work locations. They will need to add
                    locations to receive service requests.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!applicant.is_verified && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              onClick={handleApprove}
              variant="primary"
              className="px-8 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center text-lg"
            >
              Approve Technician
            </Button>
            <Button
              onClick={handleReject}
              variant="primary"
              className="px-8 py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center text-lg"
            >
              Reject Application
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        title="Certificate Preview"
        cancelText="Close"
        className="max-w-4xl"
      >
        {selectedCertificate && (
          <div className="max-h-[70vh] overflow-auto">
            <img
              src={selectedCertificate}
              alt="Certificate"
              className="max-w-full h-auto mx-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/api/placeholder/800/600";
              }}
            />
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};
