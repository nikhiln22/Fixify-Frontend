import React from "react";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import Card from "../../../components/common/Card";

export const UserService: React.FC = () => {
  return (
    <UserLayout>
      <div>
        <Banner
          title="Explore the services"
          subtitle="Find the best technicians near you"
          height="400px"
        />
        <p className="justify-end font-medium text-3xl py-10">
          Explore all services
        </p>
        <Card
          title="AC services"
          type="category"
          onClick={() => console.log("category clicked")}
        />
      </div>
    </UserLayout>
  );
};
