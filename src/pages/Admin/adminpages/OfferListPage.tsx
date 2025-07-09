import React, { useState, useCallback, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import SelectField from "../../../components/common/SelectField";
import Modal from "../../../components/common/Modal";
import { AddOffer } from "../../../components/admin/AddOffer";
import { Search } from "lucide-react";
import { showToast } from "../../../utils/toast";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import {
  addOffer,
  updateOffer,
  toggleOfferStatus,
  getAllOffers,
} from "../../../services/admin.services";
import { IOffer } from "../../../models/offer";
import { getOffersColumns } from "../../../constants/tablecolumns/offerColumns";

export const OfferListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<IOffer | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const itemsPerPage = 6;

  const statusOptions = [
    { value: "", label: "All Offers" },
    { value: "active", label: "Active Offers" },
    { value: "inactive", label: "Inactive Offers" },
  ];

  const fetchOffersWithFilters = useCallback(
    async (page: number) => {
      console.log("Fetching offers with filters:", {
        page,
        searchQuery,
        filterStatus,
      });

      return await getAllOffers(page, searchQuery, filterStatus);
    },
    [searchQuery, filterStatus]
  );

  const {
    data: offers,
    setData: setOffers,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
  } = usePaginatedList(fetchOffersWithFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("Status filter changed to:", e.target.value);
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, setCurrentPage]);

  const handleOpenAddModal = () => {
    setSelectedOffer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (offer: IOffer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
  };

  const handleSubmitOffer = async (offerData: any) => {
    setIsLoading(true);
    try {
      if (selectedOffer) {
        const response = await updateOffer(selectedOffer._id, offerData);
        if (response && offers) {
          setOffers(
            offers.map((offer) =>
              offer._id === selectedOffer._id ? response.data : offer
            )
          );
          showToast({
            message: "Offer updated successfully",
            type: "success",
          });
        }
      } else {
        const response = await addOffer(offerData);
        if (response && offers) {
          const firstPageItems = [
            response.data,
            ...offers.slice(0, itemsPerPage - 1),
          ];

          setOffers(firstPageItems);

          if (currentPage !== 1) {
            setCurrentPage(1);
          }

          showToast({
            message: "Offer added successfully",
            type: "success",
          });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${selectedOffer ? "updating" : "creating"} offer:`,
        error
      );
      showToast({
        message: `Failed to ${selectedOffer ? "update" : "add"} offer`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (offerId: string) => {
    try {
      const result = await toggleOfferStatus(offerId);
      console.log("result from toggling the offer status:", result);
      if (result) {
        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer._id === offerId
              ? result.data || { ...offer, status: !offer.status }
              : offer
          )
        );
      }

      const offer = offers.find((off) => off._id === offerId);
      const statusLabel = offer?.status ? "blocked" : "unblocked";
      showToast({
        message: `Offer ${statusLabel} successfully`,
        type: "success",
      });

      return result;
    } catch (error) {
      console.error("Failed to toggle offer status:", error);
      showToast({
        message: "Failed to update offer status",
        type: "error",
      });
      throw error;
    }
  };

  const columns = getOffersColumns(handleStatusToggle, handleOpenEditModal);

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Offers</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search offers..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-48">
              <SelectField
                label=""
                name="statusFilter"
                value={filterStatus}
                onChange={handleStatusFilterChange}
                options={statusOptions}
                placeholder="Filter by status"
                className="mb-0"
              />
            </div>
            <Button
              onClick={handleOpenAddModal}
              className="h-10 px-4 py-2 whitespace-nowrap"
            >
              Add Offer
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <Table
          data={offers || []}
          columns={columns}
          currentPage={currentPage}
          loading={loading}
          pageSize={itemsPerPage}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedOffer ? "Edit Offer" : "Add Offer"}
        className="max-w-4xl w-full mx-4"
      >
        <div className="w-full">
          <AddOffer
            onSubmit={handleSubmitOffer}
            onCancel={handleCloseModal}
            isLoading={isLoading}
            initialValues={
              selectedOffer
                ? {
                    _id: selectedOffer._id,
                    title: selectedOffer.title,
                    description: selectedOffer.description,
                    offer_type: selectedOffer.offer_type,
                    discount_type: selectedOffer.discount_type,
                    discount_value: selectedOffer.discount_value,
                    max_discount: selectedOffer.max_discount,
                    min_booking_amount: selectedOffer.min_booking_amount,
                    service_id: selectedOffer.serviceId,
                    valid_until: selectedOffer.valid_until
                      ? new Date(selectedOffer.valid_until)
                          .toISOString()
                          .split("T")[0]
                      : "",
                  }
                : undefined
            }
            isEditing={!!selectedOffer}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default OfferListPage;
