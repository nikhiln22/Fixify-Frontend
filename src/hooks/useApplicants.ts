import { getAllApplicants} from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { Itechnician } from "../models/technician";
import { useNavigate } from "react-router-dom";

const useApplicants = () => {
    const navigate = useNavigate();
  const {
    data: applicants,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<Itechnician>(getAllApplicants);

  const handleViewDetails = async (applicantId: string) => {
    console.log("Viewing details for applicant:", applicantId);
    navigate("/admin/applicantdetailpreview")
  };

  return {
    applicants,
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    handleViewDetails,
  };
};

export default useApplicants;