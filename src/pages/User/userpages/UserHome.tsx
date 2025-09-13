import React, { useEffect, useState } from "react";
import UserLayout from "../../../layouts/UserLayout";
import MostBookedServices from "../../../components/user/MostBookedServices";
import { MainBannerCarousel } from "../../../components/user/MainBannerCarousel";
import ServiceCategories from "../../../components/user/ServiceCategories";
import { getUserOffers } from "../../../services/offerService";
import { getMostBookedServices } from "../../../services/serviceService";
import { showToast } from "../../../utils/toast";

export const UserHome: React.FC = () => {
  const [mostBookedServices, setMostBookedServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const fetchMostBookedServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError(null);
      const response = await getMostBookedServices();
      setMostBookedServices(response.data || []);
    } catch (error) {
      console.error("Failed to fetch most booked services:", error);
      setServicesError("Failed to load most booked services");
      showToast({
        message: "Failed to load most booked services",
        type: "error",
      });
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await getUserOffers();
      console.log("response of all offers in user home:", response);
      setOffers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
      showToast({
        message: "Failed to load offers",
        type: "error",
      });
    } finally {
    }
  };

  useEffect(() => {
    fetchMostBookedServices();
    fetchOffers();
  }, []);

  return (
    <UserLayout>
      <div>
        <MainBannerCarousel offers={offers} />

        <ServiceCategories />

        <MostBookedServices
          services={mostBookedServices}
          loading={servicesLoading}
          error={servicesError}
        />
      </div>
    </UserLayout>
  );
};
