import { useState } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { addJobDesignation } from "../../services/admin.services";
import { showToast } from "../../utils/toast";
import { AddDesignationFormProps } from "../../types/component.types";

// Add onRefresh to your existing props
const AddDesignationForm: React.FC<AddDesignationFormProps & { onRefresh?: () => void }> = ({
  onSuccess,
  onRefresh
}) => {
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!designation.trim()) {
      showToast({ message: "Please enter a designation", type: "info" });
      return;
    }
    try {
      setLoading(true);
      const response = await addJobDesignation(designation);
      console.log("Response from addDesignationForm component:", response);
      showToast({ message: "Designation added successfully", type: "success" });
      
      // Call refresh function if provided
      if (onRefresh) {
        onRefresh();
      }
      
      onSuccess();
      setDesignation("");
    } catch (error) {
      showToast({ message: "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col justify-center h-full">
      <InputField
        label="Designation Name"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
        placeholder="Enter designation name"
        className="w-full mb-6 py-2"
      />
      <div className="flex justify-between space-x-4 mt-6">
        <Button
          onClick={onSuccess}
          className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded"
        >
          {loading ? "Adding..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AddDesignationForm;