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
import { technicianDetails } from "../../../services/technicianServices";
import { showToast } from "../../../utils/toast";
import { buildCloudinaryUrl } from "../../../utils/cloudinary/cloudinary";
import { IAddress } from "../../../models/address";
import { ReviewSection } from "../../../components/technician/ReviewSection";
import { CurrentSubscriptionPlan } from "../../../components/technician/CurrentSubscriptionPlan";
import { IRating } from "../../../models/IRating";

interface TechnicianSubscriptionData {
  planName: string;
  status: "Active" | "Expired";
  commissionRate: number;
  walletCreditDelay: number;
  profileBoost: boolean;
  durationInMonths: number;
  startDate: string;
  expiresAt?: string;
  amount: number;
}

export const TechnicianDetails: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null
  );
  const [technician, setTechnician] = useState<Itechnician | null>(null);
  const [technicianAddress, setTechnicianAddress] = useState<IAddress[]>([]);
  const [reviews, setReviews] = useState<IRating[]>([]);
  const [averageRating, setAverageRating] = useState<number | undefined>(
    undefined
  );
  const [totalReviews, setTotalReviews] = useState<number | undefined>(
    undefined
  );
  const [subscriptionData, setSubscriptionData] =
    useState<TechnicianSubscriptionData | null>(null);

  const navigate = useNavigate();
  const { technicianId } = useParams<{ technicianId: string }>();

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      if (!technicianId) {
        return;
      }

      try {
        const response = await technicianDetails(technicianId);
        console.log("response from the technician details page:", response);
        if (response.success && response.data) {
          setTechnician(response.data);
          setTechnicianAddress(response.data.addresses || []);
          setReviews(response.data.reviews || []);
          setAverageRating(response.data.averageRating);
          setTotalReviews(response.data.totalReviews);
          setSubscriptionData(response.data.currentSubscription);
        }
      } catch (err) {
        console.error("Error fetching applicant details:", err);
        showToast({
          message: "Failed to load applicant details",
          type: "error",
        });
      }
    };

    fetchTechnicianDetails();
  }, [technicianId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!technician) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen bg-gray-50 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading technician details...</p>
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
            Technician Details
          </h1>
          <Button onClick={handleBack} variant="outline" className="px-6 py-2">
            Back
          </Button>
        </div>

        <ProfileCard
          name={technician.username}
          email={technician.email}
          phone={technician.phone}
          image={
            technician.image
              ? buildCloudinaryUrl(technician.image)
              : "/default-profile.jpg"
          }
          role="technician"
          Designation={technician.Designation?.designation}
          yearsOfExperience={technician.yearsOfExperience}
          isEditable={false}
          onSave={() => {}}
        />

        <TechnicianAboutSection
          initialAbout={technician.About}
          onSave={async () => {}}
          isLoading={false}
          isEditable={false}
        />

        <TechnicianCertificatesSection
          certificates={technician.certificates?.map((cert) =>
            buildCloudinaryUrl(cert)
          )}
          onCertificatesUpdate={async () => {}}
          isLoading={false}
          isEditable={false}
        />

        <ReviewSection
          reviews={reviews}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />

        {subscriptionData && (
          <CurrentSubscriptionPlan
            subscription={subscriptionData}
            showUpgradeButton={false}
            title="Current Subscription"
            isUpcoming={false}
          />
        )}

        <div className="bg-white rounded-3xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Work Locations
          </h2>

          {technicianAddress && technicianAddress.length > 0 ? (
            <div className="space-y-4">
              {technicianAddress.map((address, index) => (
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
                      {technicianAddress.length > 1 ? `${index + 1}` : ""}
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
                  This technician has not specified any work locations yet.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note:</span> This technician
                    has not added work locations. They will need to add
                    locations to receive service requests.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
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
