import React from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import TechnicianProfileCard from "../../../components/technician/TechnicianProfileCard";
import Button from "../../../components/common/Button";
import { useAppSelector } from "../../../hooks/useRedux";

const TechnicianProfile: React.FC = () => {
  const technicianData = useAppSelector(
    (state) => state.technician.technicianData
  );

  console.log("technicianData:",technicianData);

  const handleEditClick = () => {
    console.log("Edit button clicked");
  };

  return (
    <TechnicianLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
          <Button variant="primary" onClick={handleEditClick} className="px-10">
            Edit
          </Button>
        </div>
        {technicianData ? (
          <TechnicianProfileCard
            name={technicianData.username || ""}
            email={technicianData.email || ""}
            phone={technicianData.phone || "+919845397500"}
            department={technicianData.Designation || "A/C Mechanic"}
            yearOfExperience={technicianData.yearsOfExperience || 5}
            location={technicianData.address || "HSR Layout, Bengaluru"}
            profilePhoto={technicianData.image || null}
          />
        ) : (
          <div className="bg-gray-100 rounded-3xl shadow-md p-6">
            <p>Loading profile data...</p>
          </div>
        )}
      </div>
    </TechnicianLayout>
  );
};

export default TechnicianProfile;