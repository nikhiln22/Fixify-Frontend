import React from "react";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import Card from "../../../components/common/Card";
import { getAllCategories } from "../../../services/categoryService";
import Pagination from "../../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import { Icategory } from "../../../models/category";
import { buildCloudinaryUrl } from "../../../utils/cloudinary/cloudinary";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import technicianBanner from "../../../assets/technician Banner.png";

export const UserCategory: React.FC = () => {
  const navigate = useNavigate();
  const itemsPerPage = 6;

  const {
    data: categories,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<Icategory>(getAllCategories, "", "", itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryClick = (category: Icategory) => {
    console.log("category clicked", category);
    navigate(`/user/services/${category._id}`, {
      state: { categoryName: category.name },
    });
  };

  return (
    <UserLayout>
      <div>
        <Banner backgroundImage={technicianBanner} height="400px" />
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <p className="text-left text-2xl font-bold py-10">
            Choose your services
          </p>

          {error && (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-12">
                {categories.map((category) => (
                  <Card
                    key={category._id}
                    image={
                      category.image
                        ? buildCloudinaryUrl(category.image)
                        : "/default-category-image.jpg"
                    }
                    title={category.name}
                    type="category"
                    buttonLabel="Book Now"
                    onClick={() => handleCategoryClick(category)}
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
                <p className="text-lg text-gray-600">No categories found</p>
              </div>
            )
          )}
        </div>
      </div>
    </UserLayout>
  );
};
