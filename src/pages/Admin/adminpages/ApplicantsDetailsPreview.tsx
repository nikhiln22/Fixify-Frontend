import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import { getTechnicianProfile } from "../../../services/common.services";
import { Itechnician } from "../../../models/technician";
import TechnicianProfileCard from "../../../components/technician/TechnicianProfileCard";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import {
  verifyApplicant,
  rejectApplicant,
} from "../../../services/admin.services";
import { showToast } from "../../../utils/toast";

export const ApplicantDetailsPreview: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null
  );
  const [applicant, setApplicant] = useState<Itechnician | null>(null);

  const navigate = useNavigate();
  const { applicantId } = useParams<{ applicantId: string }>();

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      if (!applicantId) {
        return;
      }

      try {
        const response = await getTechnicianProfile("admin", applicantId);
        setApplicant(response);
      } catch (err) {
        console.error("Error fetching applicant details:", err);
      }
    };

    fetchApplicantDetails();
  }, [applicantId]);

  const formatAddress = (fullAddress: string) => {
    const parts = fullAddress.split(", ");
    if (parts.length >= 4) {
      const city = parts[parts.length - 4] || "";
      const state = parts[parts.length - 3] || "";
      const pincode = parts[parts.length - 2] || "";
      const area = parts[parts.length - 5] || "";
      return `${area},${city}, ${state} ${pincode}`;
    }
    return fullAddress;
  };

  const handleApprove = async () => {
    if (!applicantId) return;

    try {
      await verifyApplicant(applicantId);
      showToast({
        message: "technician approved successfully",
        type: "success",
      });
      navigate('/admin/technicianlist');
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
        message: "failed to reject applicant",
        type: "error",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!applicant) {
    return null;
  }

  // Determine the page title based on verification status
  const pageTitle = applicant.is_verified 
    ? "Technician Details" 
    : "Technician Application Details";

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">
            {pageTitle}
          </h1>
          <Button onClick={handleBack} variant="outline" className="px-6 py-2">
            Back
          </Button>
        </div>

        <div className="mb-8">
          <TechnicianProfileCard
            name={applicant.username || "N/A"}
            email={applicant.email || "N/A"}
            phone={applicant.phone || 0}
            Designation={applicant.Designation || "N/A"}
            yearsOfExperience={applicant.yearsOfExperience || 0}
            profilePhoto={applicant.image}
            address={formatAddress(applicant.address || "")}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-md p-8 mb-8 w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">About</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {applicant.About || "No additional information provided."}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md mb-8 w-full">
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Certificates
            </h3>
          </div>
          <div className="p-8">
            {applicant.certificates && applicant.certificates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {applicant.certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
                    onClick={() => setSelectedCertificate(cert)}
                  >
                    <div className="bg-white px-4 py-3 border-b border-gray-200">
                      <h4 className="font-medium text-gray-800">
                        Certificate {index + 1}
                      </h4>
                    </div>
                    <div className="p-4 h-40 flex items-center justify-center">
                      <img
                        src={cert}
                        alt={`Certificate ${index + 1}`}
                        className="max-h-full max-w-full object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/150/100";
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-gray-500 text-lg">
                No certificates uploaded
              </p>
            )}
          </div>
        </div>

        {!applicant.is_verified && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
      </div>
    </AdminLayout>
  );
};