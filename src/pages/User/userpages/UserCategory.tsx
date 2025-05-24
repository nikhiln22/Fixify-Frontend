import React, { useState, useEffect } from "react";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import Card from "../../../components/common/Card";
import { getAllCategories } from "../../../services/common.services";
import Pagination from "../../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import { Icategory } from "../../../models/category";

export const UserCategory: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Icategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchCategories = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getAllCategories(page, "", "user");
      console.log("response from the categoryListing page:", response);

      setCategories(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchCategories(page);
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
        <Banner
          title="Explore the services"
          subtitle="Find the best technicians near you"
          height="400px"
        />
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <p className="text-left text-2xl font-bold py-10">
            Choose your services
          </p>
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
                    image={category.image || "/default-category-image.jpg"}
                    title={category.name}
                    type="category"
                    buttonLabel="Book Now"
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-2">
                  Ready to Get Started? Choose Your Service and Let's Go!
                </h3>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-20">
              <p className="text-lg text-gray-600">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};
