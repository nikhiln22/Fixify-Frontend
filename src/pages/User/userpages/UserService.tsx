import React from "react";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import Card from "../../../components/common/Card";
import { getAllServices } from "../../../services/serviceService";
import Pagination from "../../../components/common/Pagination";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IService } from "../../../models/service";
import { buildCloudinaryUrl } from "../../../utils/cloudinary/cloudinary";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import technicianBanner from "../../../assets/technician Banner.png";

export const UserService: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const itemsPerPage = 6;

  const categoryName = location.state?.categoryName || "Services";

  const {
    data: services,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<IService>(
    getAllServices,
    "user",
    "",
    "",
    itemsPerPage,
    categoryId
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleServiceClick = (service: IService) => {
    console.log("service clicked", service);
    navigate(`/user/servicedetails/${service._id}`);
  };

  return (
    <UserLayout>
      <div>
        <Banner backgroundImage={technicianBanner} height="400px" />
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <p className="text-left text-2xl font-bold py-10">
            Choose your {categoryName.toLowerCase()}
          </p>

          {error && (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

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
                    image={
                      service.image
                        ? buildCloudinaryUrl(service.image)
                        : "/default-service-image.jpg"
                    }
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
            !loading && (
              <div className="flex justify-center items-center py-20">
                <p className="text-lg text-gray-600">
                  No services found for this category
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </UserLayout>
  );
};
