import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import ServiceHeader from "../../../components/user/ServiceHeader";
import TechnicianList from "../../../components/user/TechnicianList";
import AddressSelector from "../../../components/user/AddressSelector";
import RelatedServices from "../../../components/user/RelatedServices";
import { getNearbyTechnicians } from "../../../services/userServices";
import { getAddresses } from "../../../services/addressService";
import { IService } from "../../../models/service";
import { IAddress } from "../../../models/address";
import { getServiceDetails } from "../../../services/serviceService";
import technicianBanner from "../../../assets/technician Banner.png";
import { Itechnician } from "../../../models/technician";

export const UserServiceDetails: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Itechnician | null>(null);
  const [serviceData, setServiceData] = useState<IService | null>(null);
  const [relatedServices, setRelatedServices] = useState<IService[]>([]);
  const [userAddresses, setUserAddresses] = useState<IAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [technicians, setTechnicians] = useState<
    (Itechnician & { averageRating: number })[]
  >([]);

  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false);

  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  console.log("serviceId in the user service details page:", serviceId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingAddresses(true);

        const [serviceResponse, addressesResponse] = await Promise.all([
          serviceId ? getServiceDetails(serviceId) : Promise.resolve(null),
          getAddresses(),
        ]);

        if (serviceResponse) {
          setServiceData(serviceResponse.service);
          setRelatedServices(serviceResponse.relatedService || []);
        }

        if (addressesResponse) {
          const addresses = addressesResponse.data || [];
          setUserAddresses(addresses);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setUserAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const fetchTechnicians = useCallback(
    async (address: IAddress) => {
      if (!address) {
        console.log("No address provided, returning early");
        return;
      }

      if (!serviceData) {
        console.log("No serviceData available, returning early");
        return;
      }

      if (!address.latitude || !address.longitude) {
        console.log("Address coordinates not available");
        return;
      }

      try {
        setIsLoadingTechnicians(true);
        console.log("Starting to fetch technicians...");

        const techniciansList = await getNearbyTechnicians(
          serviceData.designation as unknown as string,
          address.latitude,
          address.longitude,
          10
        );

        console.log("techniciansList received:", techniciansList);

        const techniciansWithRating = techniciansList.map(
          (tech) => tech as Itechnician & { averageRating: number }
        );

        setTechnicians(techniciansWithRating);
      } catch (error) {
        console.error("Error fetching technicians:", error);
        setTechnicians([]);
      } finally {
        setIsLoadingTechnicians(false);
      }
    },
    [serviceData]
  );

  const handleAddressSelect = useCallback(
    (address: IAddress) => {
      setSelectedAddress(address);
      setSelectedTechnician(null);
      setTechnicians([]);
      console.log("About to call fetchTechnicians with address:", address);
      fetchTechnicians(address);
    },
    [fetchTechnicians]
  );

  const handleTechnicianSelect = useCallback(
    (technician: Itechnician) => {
      setSelectedTechnician(technician);
      console.log("Selected technician:", technician);

      navigate("/user/booking", {
        state: {
          service: serviceData,
          address: selectedAddress,
          technician: technician,
        },
      });
    },
    [navigate, serviceData, selectedAddress]
  );

  const handleRelatedServiceSelect = useCallback((service: IService) => {
    console.log("Selected related service:", service);
  }, []);

  return (
    <UserLayout>
      <Banner backgroundImage={technicianBanner} height="400px" />

      <div className="container mx-auto px-4 py-8">
        <ServiceHeader service={serviceData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-6">
            <AddressSelector
              onAddressSelect={handleAddressSelect}
              selectedAddress={selectedAddress}
              addresses={userAddresses}
              isLoading={isLoadingAddresses}
            />
          </div>

          <div className="space-y-6">
            <TechnicianList
              onTechnicianSelect={handleTechnicianSelect}
              selectedTechnicianId={selectedTechnician?._id}
              serviceId={serviceId}
              selectedAddress={selectedAddress}
              technicians={technicians}
              isLoading={isLoadingTechnicians}
            />
          </div>
        </div>

        <div className="mt-12">
          <RelatedServices
            relatedServices={relatedServices}
            onServiceSelect={handleRelatedServiceSelect}
          />
        </div>
      </div>
    </UserLayout>
  );
};
