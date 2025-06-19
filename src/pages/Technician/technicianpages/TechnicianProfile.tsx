import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import {ProfileCard} from "../../../components/common/ProfileCard";
import { TechnicianAboutSection } from "../../../components/technician/AboutSection";
import { TechnicianCertificatesSection } from "../../../components/technician/CertificateSection";
import { getTechnicianProfile } from "../../../services/common.services";
import { Itechnician } from "../../../models/technician";
import { updateTechnicianData } from "../../../redux/slices/technicianslice";
import { useDispatch } from "react-redux";
import { showToast } from "../../../utils/toast";

export const TechnicianProfile: React.FC = () => {
  const dispatch = useDispatch();
  const [technicianData, setTechnicianData] = useState<Itechnician | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTechnicianProfile();
  }, []);

  const fetchTechnicianProfile = async () => {
    try {
      const response = await getTechnicianProfile();
      console.log(
        "techncian profile response in the technician profile page:",
        response
      );
      if (response) {
        setTechnicianData(response);
      }
    } catch (err) {
      console.error("Error fetching technician profile:", err);
      showToast({
        message: "Failed to load technician profile",
        type: "error",
      });
    }
  };

  const handleProfileSave = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const response = await editTechnicianProfile(formData);
      console.log("Technician profile updated successfully:", response);

      if (response && technicianData) {
        setTechnicianData((prevTechnicianData) => ({
          ...prevTechnicianData!,
          username: response.username || prevTechnicianData!.username,
          phone: response.phone || prevTechnicianData!.phone,
          image:
            response.image !== undefined
              ? response.image
              : prevTechnicianData!.image,
          designation: response.designation || prevTechnicianData!.Designation,
          yearsOfExperience:
            response.yearsOfExperience || prevTechnicianData!.yearsOfExperience,
        }));

        const updatedTechnicianData = {
          username: response.username || technicianData.username,
          phone: response.phone || technicianData.phone,
          image:
            response.image !== undefined
              ? response.image
              : technicianData.image,
          designation: response.designation || technicianData.Designation,
          yearsOfExperience:
            response.yearsOfExperience || technicianData.yearsOfExperience,
        };

        dispatch(updateTechnicianData(updatedTechnicianData));

        showToast({
          message: "Profile updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating technician profile:", error);
      showToast({
        message: "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAboutSave = async (aboutText: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("About", aboutText);

      const response = await editTechnicianProfile(formData);
      if (response) {
        setTechnicianData((prev) =>
          prev ? { ...prev, About: aboutText } : null
        );
        showToast({
          message: "About section updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating about section:", error);
      showToast({
        message: "Failed to update about section",
        type: "error",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificatesUpdate = async (files: File[]) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`certificate_${index}`, file);
      });

      const response = await editTechnicianProfile(formData);
      if (response) {
        await fetchTechnicianProfile();
        showToast({
          message: "Certificates added successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error adding certificates:", error);
      showToast({
        message: "Failed to add certificates",
        type: "error",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 flex-shrink-0 p-6">
          <TechnicianProfileSidebar />
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-68 space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            </div>

            <ProfileCard
              name={technicianData.username}
              email={technicianData.email}
              phone={technicianData.phone}
              image={technicianData.image}
              role="technician"
              Designation={technicianData.Designation}
              yearsOfExperience={technicianData.yearsOfExperience}
              isEditable={true}
              onSave={handleProfileSave}
            />

            <TechnicianAboutSection
              initialAbout={technicianData.About}
              onSave={handleAboutSave}
              isLoading={isLoading}
            />

            <TechnicianCertificatesSection
              certificates={technicianData.certificates}
              onCertificatesUpdate={handleCertificatesUpdate}
              isLoading={isLoading}
            />

            {technicianData.address && (
              <div className="bg-white rounded-3xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Work Location
                </h2>
                <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Service Area
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      {technicianData.address}
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Coverage Area:</span> You
                        can accept service requests within 10 km radius from
                        this location
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
};
