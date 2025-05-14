import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { addJobDesignation } from "../../services/admin.services";
import { showToast } from "../../utils/toast";
import { AddDesignationFormProps } from "../../types/component.types";

const AddDesignationForm: React.FC<
  AddDesignationFormProps & { onRefresh?: () => void }
> = ({ onSuccess, onRefresh }) => {
  const validationSchema = Yup.object().shape({
    designation: Yup.string()
      .trim()
      .required("Designation name is required")
      .min(2, "Designation must be at least 2 characters")
      .max(50, "Designation must not exceed 50 characters")
      .matches(
        /^[a-zA-Z0-9\s-]+$/,
        "Designation can only contain letters, numbers, spaces, and hyphens",
      ),
  });

  const handleSubmit = async (
    values: { designation: string },
    { setSubmitting, resetForm }: any,
  ) => {
    try {
      const response = await addJobDesignation(values.designation);
      console.log("Response from addDesignationForm component:", response);
      showToast({ message: "Designation added successfully", type: "success" });

      if (onRefresh) {
        onRefresh();
      }

      onSuccess();
      resetForm();
    } catch (error) {
      showToast({ message: "Something went wrong", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <Formik
        initialValues={{ designation: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <div className="mb-6">
              <InputField
                label="Designation Name"
                name="designation"
                value={values.designation}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter designation name"
                className={`w-full py-2 ${
                  errors.designation && touched.designation
                    ? "border-red-500"
                    : ""
                }`}
              />
              {errors.designation && touched.designation && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.designation}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-4 mt-6">
              <Button
                type="button"
                onClick={onSuccess}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded"
              >
                {isSubmitting ? "Adding..." : "Submit"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddDesignationForm;
