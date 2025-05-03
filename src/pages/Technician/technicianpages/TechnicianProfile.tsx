import React from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";

const TechnicianProfile: React.FC = () => {
  return (
    <TechnicianLayout isVerified={true}>
      <div>
        welcome to my profile page
      </div>
    </TechnicianLayout>
  );
};

export default TechnicianProfile;