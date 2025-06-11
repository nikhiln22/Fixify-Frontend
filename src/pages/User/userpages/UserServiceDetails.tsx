import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import ServiceHeader from "../../../components/user/ServiceHeader";
import TechnicianList from "../../../components/user/TechncianList";
import AddressSelector from "../../../components/user/AddressSelector";
import RelatedServices from "../../../components/user/RelatedServices";
import {
  getServiceDetails,
  getUserAddresses,
  getNearbyTechnicians,
} from "../../../services/user.services";
import { IService } from "../../../models/service";
import { IAddress } from "../../../models/address";

export const UserServiceDetails: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [serviceData, setServiceData] = useState<IService | null>(null);
  const [relatedServices, setRelatedServices] = useState<any[]>([]);
  const [userAddresses, setUserAddresses] = useState<IAddress[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false);

  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  console.log("serviceId in the user service details page:", serviceId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceResponse, addressesResponse] = await Promise.all([
          serviceId ? getServiceDetails(serviceId) : Promise.resolve(null),
          getUserAddresses(),
        ]);

        if (serviceResponse) {
          setServiceData(serviceResponse.service);
          setRelatedServices(serviceResponse.relatedService || []);
          console.log("Setting serviceData to:", serviceResponse.service);
          console.log(
            "Setting relatedServices to:",
            serviceResponse.relatedService
          );
        }

        if (addressesResponse) {
          const addresses = addressesResponse.data || [];
          setUserAddresses(addresses);
          console.log("Setting userAddresses to:", addresses);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [serviceId]);

  const fetchTechnicians = useCallback(
    async (address: IAddress) => {
      console.log("fetchTechnicians called with address:", address);
      console.log("serviceData available:", !!serviceData);
      console.log("serviceData:", serviceData);

      if (!address) {
        console.log("No address provided, returning early");
        return;
      }

      if (!serviceData) {
        console.log("No serviceData available, returning early");
        return;
      }

      try {
        setIsLoadingTechnicians(true);
        console.log("Starting to fetch technicians...");

        const techniciansList = await getNearbyTechnicians(
          serviceData.designation,
          address.latitude,
          address.longitude,
          10
        );

        console.log("techniciansList received:", techniciansList);

        const processedTechnicians = techniciansList.map((technician: any) => ({
          ...technician, 
          id: technician._id,
          name: technician.username, 
          experience: `${technician.yearsOfExperience} years`, 
          profileImage: technician.image, 
          verified: technician.is_verified,
        }));

        setTechnicians(processedTechnicians);
        
        console.log("Technicians state updated");
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
      console.log("handleAddressSelect called with:", address);
      console.log("Current selectedAddress:", selectedAddress);

      setSelectedAddress(address);
      setSelectedTechnician(null);
      setTechnicians([]);
      console.log("About to call fetchTechnicians with address:", address);
      fetchTechnicians(address);
    },
    [fetchTechnicians]
  );

  const handleTechnicianSelect = useCallback((technician: any) => {
    setSelectedTechnician(technician);
    console.log("Selected technician:", technician);
    

    navigate('/user/booking', {
      state: {
        service: serviceData,
        address: selectedAddress,
        technician: technician
      }
    });
  }, [navigate, serviceData, selectedAddress]);

  const handleRelatedServiceSelect = useCallback((service: any) => {
    console.log("Selected related service:", service);
  }, []);

  const handleBookService = useCallback(() => {
    if (!selectedAddress) {
      alert("Please select a service address");
      return;
    }
    if (!selectedTechnician) {
      alert("Please select a technician");
      return;
    }

    console.log("Booking service with:", {
      service: serviceData,
      address: selectedAddress,
      technician: selectedTechnician,
    });

    navigate('/user/booking', {
      state: {
        service: serviceData,
        address: selectedAddress,
        technician: selectedTechnician
      }
    });
  }, [selectedAddress, selectedTechnician, serviceData, navigate]);

  return (
    <UserLayout>
      <Banner
        title="Professional Home Services"
        subtitle="Find the best service providers near you"
        height="400px"
      />

      <div className="container mx-auto px-4 py-8">
        <ServiceHeader service={serviceData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-6">
            <AddressSelector
              onAddressSelect={handleAddressSelect}
              selectedAddress={selectedAddress}
              addresses={userAddresses}
            />
          </div>

          <div className="space-y-6">
            <TechnicianList
              onTechnicianSelect={handleTechnicianSelect}
              selectedTechnicianId={selectedTechnician?.id}
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