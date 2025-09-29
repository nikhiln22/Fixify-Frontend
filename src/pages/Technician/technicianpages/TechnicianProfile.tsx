import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import { ProfileCard } from "../../../components/common/ProfileCard";
import { TechnicianAboutSection } from "../../../components/technician/AboutSection";
import { TechnicianCertificatesSection } from "../../../components/technician/CertificateSection";
import { getTechnicianProfile } from "../../../services/technicianServices";
import { getReviews } from "../../../services/technicianServices";
import { Itechnician } from "../../../models/technician";
// import { updateTechnicianData } from "../../../redux/slices/technicianslice";
// import { useDispatch } from "react-redux";
import { showToast } from "../../../utils/toast";
import { ReviewSection } from "../../../components/technician/ReviewSection";
import { IRating } from "../../../models/IRating";
import { buildCloudinaryUrl } from "../../../utils/cloudinary/cloudinary";
import { getAddresses } from "../../../services/addressService";
import { IAddress } from "../../../models/address";

export const TechnicianProfile: React.FC = () => {
  // const dispatch = useDispatch();
  const [technicianData, setTechnicianData] = useState<Itechnician | null>(
    null
  );
  const [technicianAddress, setTechnicianAddress] = useState<IAddress[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const [reviews, setReviews] = useState<IRating[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | undefined>(
    undefined
  );
  const [totalReviews, setTotalReviews] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchTechnicianProfile = async () => {
      try {
        const response = await getTechnicianProfile();
        if (response) {
          setTechnicianData(response);
          fetchTechnicianAddress();
        }
      } catch (err) {
        console.error("Error fetching technician profile:", err);
        showToast({
          message: "Failed to load technician profile",
          type: "error",
        });
      }
    };

    const fetchTechnicianReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const response = await getReviews();

        if (response.data.reviews) {
          setReviews(response.data.reviews || []);
          setAverageRating(response.data.averageRating);
          setTotalReviews(response.data.totalReviews);
        } else {
          setReviewsError(response.data.message || "Failed to load reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        const error = err as { response?: { data?: { message?: string } } };
        const errorMessage =
          error?.response?.data?.message || "Something went wrong!";
        setReviewsError(errorMessage);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchTechnicianProfile();
    fetchTechnicianReviews();
  }, []);

  const fetchTechnicianAddress = async () => {
    try {
      setAddressLoading(true);
      const response = await getAddresses();
      console.log("Address response:", response);

      if (!response.data) {
        return;
      }

      if (response && response.data) {
        setTechnicianAddress(response.data);
      } else {
        setTechnicianAddress([]);
      }
    } catch (err) {
      console.error("Error fetching technician address:", err);
      setTechnicianAddress([]);
    } finally {
      setAddressLoading(false);
    }
  };

  // const handleProfileSave = async (formData: FormData) => {
  //   setIsLoading(true);

  //   try {
  //     const response = await editTechnicianProfile(formData);
  //     console.log("Technician profile updated successfully:", response);

  //     if (response && technicianData) {
  //       setTechnicianData((prevTechnicianData) => ({
  //         ...prevTechnicianData!,
  //         username: response.username || prevTechnicianData!.username,
  //         phone: response.phone || prevTechnicianData!.phone,
  //         image:
  //           response.image !== undefined
  //             ? response.image
  //             : prevTechnicianData!.image,
  //         designation: response.designation || prevTechnicianData!.Designation,
  //         yearsOfExperience:
  //           response.yearsOfExperience || prevTechnicianData!.yearsOfExperience,
  //       }));

  //       const updatedTechnicianData = {
  //         username: response.username || technicianData.username,
  //         phone: response.phone || technicianData.phone,
  //         image:
  //           response.image !== undefined
  //             ? response.image
  //             : technicianData.image,
  //         designation: response.designation || technicianData.Designation,
  //         yearsOfExperience:
  //           response.yearsOfExperience || technicianData.yearsOfExperience,
  //       };

  //       dispatch(updateTechnicianData(updatedTechnicianData));

  //       showToast({
  //         message: "Profile updated successfully",
  //         type: "success",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating technician profile:", error);
  //     showToast({
  //       message: "Failed to update profile",
  //       type: "error",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleAboutSave = async (aboutText: string) => {
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("About", aboutText);

  //     const response = await editTechnicianProfile(formData);
  //     if (response) {
  //       setTechnicianData((prev) =>
  //         prev ? { ...prev, About: aboutText } : null
  //       );
  //       showToast({
  //         message: "About section updated successfully",
  //         type: "success",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating about section:", error);
  //     showToast({
  //       message: "Failed to update about section",
  //       type: "error",
  //     });
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCertificatesUpdate = async (files: File[]) => {
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData();
  //     files.forEach((file, index) => {
  //       formData.append(`certificate_${index}`, file);
  //     });

  //     const response = await editTechnicianProfile(formData);
  //     if (response) {
  //       await fetchTechnicianProfile();
  //       showToast({
  //         message: "Certificates added successfully",
  //         type: "success",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error adding certificates:", error);
  //     showToast({
  //       message: "Failed to add certificates",
  //       type: "error",
  //     });
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  if (!technicianData) {
    return (
      <TechnicianLayout>
        <div className="flex min-h-screen bg-gray-50 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            </div>

            <ProfileCard
              name={technicianData.username}
              email={technicianData.email}
              phone={technicianData.phone}
              image={
                technicianData.image
                  ? buildCloudinaryUrl(technicianData.image)
                  : "/default-profile.jpg"
              }
              role="technician"
              Designation={technicianData.Designation?.designation}
              yearsOfExperience={technicianData.yearsOfExperience}
              isEditable={true}
              // onSave={handleProfileSave}
            />

            <TechnicianAboutSection
              initialAbout={technicianData.About}
              // onSave={handleAboutSave}
              // isLoading={isLoading}
              isEditable
            />

            <TechnicianCertificatesSection
              certificates={technicianData.certificates?.map((cert) =>
                buildCloudinaryUrl(cert)
              )}
              // onCertificatesUpdate={handleCertificatesUpdate}
              // isLoading={isLoading}
              isEditable
            />

            <ReviewSection
              reviews={reviews}
              loading={reviewsLoading}
              error={reviewsError}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />

            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Work Locations
              </h2>

              {addressLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">
                    Loading addresses...
                  </span>
                </div>
              ) : technicianAddress && technicianAddress.length > 0 ? (
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
                            <span className="font-medium">Coverage Area:</span>{" "}
                            You can accept service requests within 10 km radius
                            from this location
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
                      No addresses specified. Please update your work locations.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Note:</span> Add your work
                        locations to receive service requests in your areas.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
};
