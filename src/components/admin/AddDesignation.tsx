import React from "react";
import { useFormik } from "formik";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { AddDesignationFormProps } from "../../types/component.types";
import { addDesignationSchema } from "../../utils/validations/formvalidationSchema";

const AddDesignationForm: React.FC<AddDesignationFormProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
}) => {
  const formik = useFormik({
    initialValues: {
      designation: "",
    },
    validationSchema: addDesignationSchema,
    onSubmit: async (values) => {
      try {
        if (onSubmit) {
          await onSubmit(values.designation);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-6">
        <InputField
          label="Designation Name"
          name="designation"
          value={formik.values.designation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter designation name"
          error={
            formik.touched.designation && formik.errors.designation
              ? formik.errors.designation
              : undefined
          }
          touched={formik.touched.designation}
        />
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading || formik.isSubmitting}
          disabled={formik.isSubmitting}
        >
          Add
        </Button>
      </div>
    </form>
  );
};

export default AddDesignationForm;