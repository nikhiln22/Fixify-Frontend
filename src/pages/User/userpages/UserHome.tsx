import React, { useEffect, useState } from "react";
import UserLayout from "../../../layouts/UserLayout";
import MostBookedServices from "../../../components/user/MostBookedServices";
import MainBannerCarousel from "../../../components/user/MainBannerCarousel";
import ServiceCategories from "../../../components/user/ServiceCategories";
import {
  getMostBookedServices,
  getAllOffers,
} from "../../../services/user.services";


export const UserHome: React.FC = () => {
  const [mostBookedServices, setMostBookedServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getMostBookedServices();
        setMostBookedServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await getAllOffers();
        console.log("response of all offers in user home:", response);
        setOffers(response.data);
      } catch (error) {
        console.log("failed to fetch the offers:", error);
      } finally {
        setOffersLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <UserLayout>
      <div className="mb-8">
        <MainBannerCarousel offers={offers} />
      </div>

      <ServiceCategories />

      <MostBookedServices services={mostBookedServices} loading={loading} />
    </UserLayout>
  );
};