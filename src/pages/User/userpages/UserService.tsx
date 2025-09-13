import React, { useState } from "react";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import Card from "../../../components/common/Card";
import { getAllServices } from "../../../services/serviceService";
import Pagination from "../../../components/common/Pagination";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { IService } from "../../../models/service";
import { buildCloudinaryUrl } from "../../../utils/cloudinary/cloudinary";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import technicianBanner from "../../../assets/technician Banner.png";
import SelectField from "../../../components/common/SelectField";

export const UserService: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const itemsPerPage = 6;
  const [selectedServiceType, setSelectedServiceType] = useState("");

  const isSearchView = !categoryId && searchQuery;
  const categoryName = location.state?.categoryName || "Services";

  const getPageTitle = () => {
    if (isSearchView) {
      return `Search results for "${searchQuery}"`;
    }
    return `Choose your ${categoryName.toLowerCase()}`;
  };

  const searchTerm = isSearchView ? searchQuery : "";

  const {
    data: services,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<IService>(
    getAllServices,
    searchTerm,
    "active",
    itemsPerPage,
    categoryId,
    selectedServiceType
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleServiceClick = (service: IService) => {
    console.log("service clicked", service);
    navigate(`/user/servicedetails/${service._id}`);
  };

  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServiceType(e.target.value);
  };

  const getNoResultsMessage = () => {
    if (isSearchView) {
      return `No services found for "${searchQuery}"`;
    }
    return "No services found for this category";
  };

  return (
    <UserLayout>
      <div>
        <Banner backgroundImage={technicianBanner} height="400px" />
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <div className="flex justify-between items-center py-10">
            <div>
              <p className="text-2xl font-bold">{getPageTitle()}</p>
              {isSearchView && (
                <p className="text-gray-600 mt-2">
                  Found {services.length} service
                  {services.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="w-64">
              <SelectField
                name="serviceType"
                value={selectedServiceType}
                onChange={handleServiceTypeChange}
                options={[
                  { value: "all", label: "All Services" },
                  { value: "hourly", label: "Hourly Services" },
                  { value: "fixed", label: "Fixed Price Services" },
                ]}
                placeholder="Filter services"
              />
            </div>
          </div>

          {isSearchView && (
            <div className="mb-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <p className="text-cyan-800">
                Showing search results for:{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </p>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg text-gray-600">Loading services...</p>
            </div>
          ) : (
            <div className="flex-1">
              {services.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                          service.price ||
                          Math.floor(Math.random() * 2000) + 500
                        }
                        type="service"
                        serviceType={service.serviceType}
                        estimatedTime={service.estimatedTime}
                        hourlyRate={service.hourlyRate}
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
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">
                      {getNoResultsMessage()}
                    </p>
                    {isSearchView && (
                      <button
                        onClick={() => navigate("/user/categories")}
                        className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                      >
                        Browse All Categories
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};
