import React from "react";
import { useFormik } from "formik";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { AddMoneyFormProps } from "../../types/component.types";
import { addMoneySchema } from "../../utils/validations/formvalidationSchema";

export const AddMoneyForm: React.FC<AddMoneyFormProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
}) => {
  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: addMoneySchema,
    onSubmit: async (values) => {
      try {
        if (onSubmit) {
          await onSubmit(parseFloat(values.amount));
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
          label="Amount"
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter the amount"
          error={
            formik.touched.amount && formik.errors.amount
              ? formik.errors.amount
              : undefined
          }
          touched={formik.touched.amount}
          disabled={isLoading || formik.isSubmitting}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-left">
        <p className="text-sm text-gray-600">
          You will be redirected to a secure payment gateway to complete the
          transaction.
        </p>
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
          Add Money
        </Button>
      </div>
    </form>
  );
};
