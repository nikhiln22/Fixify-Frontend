import { useCallback } from "react";
import { getAllApplicants } from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { Itechnician } from "../models/technician";
import { useNavigate } from "react-router-dom";

const useApplicants = () => {
  const navigate = useNavigate();

  // Fetch applicants paginated
  const {
    data: applicants,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<Itechnician>(getAllApplicants);

  // Action: View/Edit applicant details
  const handleViewDetails = useCallback(
    (applicantId: string) => {
      console.log("Viewing details for applicant:", applicantId);
      navigate(`/admin/applicantdetailpreview/${applicantId}`);
    },
    [navigate],
  );

  return {
    applicants,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    handleViewDetails,
  };
};

export default useApplicants;
