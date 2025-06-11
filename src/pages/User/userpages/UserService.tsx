import React, { useState, useEffect } from "react";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import Card from "../../../components/common/Card";
import { getAllServices } from "../../../services/common.services";
import Pagination from "../../../components/common/Pagination";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IService } from "../../../models/service";

export const UserService: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams<{ categoryId: string }>();

  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const categoryName = location.state?.categoryName || "Services";

  const fetchServices = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getAllServices(page, "", categoryId, "user");
      console.log("response from the serviceListing page:", response);
      setServices(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1);
  }, [categoryId]);

  const handlePageChange = (page: number) => {
    fetchServices(page);
  };

  const handleServiceClick = (service: IService) => {
    console.log("service clicked", service);
    navigate(`/user/servicedetails/${service._id}`);
  };

  return (
    <UserLayout>
      <div>
        <Banner
          title={`Explore ${categoryName}`}
          subtitle="Find the best service providers near you"
          height="400px"
        />
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <p className="text-left text-2xl font-bold py-10">
            Choose your {categoryName.toLowerCase()}
          </p>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg text-gray-600">Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-12">
                {services.map((service) => (
                  <Card
                    key={service._id}
                    image={service.image || "/default-service-image.jpg"}
                    title={service.name}
                    price={
                      service.price || Math.floor(Math.random() * 2000) + 500
                    }
                    type="service"
                    onClick={() => handleServiceClick(service)}
                    buttonLabel="Book Now"
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />

              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-2">
                  Ready to Get Started? Choose Your Service and Let's Go!
                </h3>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg text-gray-600">
                No services found for this category
              </p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};
