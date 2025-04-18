import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import useJobDesignations from "../../../hooks/useJobDesignation";
import { getJobDesignationColumns } from "../../../constants/tablecolumns/jobDesignationColumn";
import TableWithPagination from "../../../components/common/TableWithPagination";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import AddDesignationForm from "../../../components/admin/AddDesignation";

function JobDesignationPage() {
  const {
    designations,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusToggle,
    loading,
    error,
    refreshDesignations,
  } = useJobDesignations();
  
  const columns = getJobDesignationColumns(handleStatusToggle);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleAddDesignationSuccess = () => {
    handleCloseModal();
  };

  return (
    <AdminLayout>
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Job Designations
        </h1>
        <Button onClick={handleOpenModal} className="mb-4">
          Add Job Designation
        </Button>
      </div>
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <TableWithPagination
        data={designations}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />
      
      <Modal isopen={isModalOpen} onclose={handleCloseModal}>
        <div className="p-4 w-full">
          <AddDesignationForm 
            onSuccess={handleAddDesignationSuccess}
            onRefresh={refreshDesignations}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
}

export default JobDesignationPage;