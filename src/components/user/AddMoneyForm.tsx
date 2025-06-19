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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === "") {
      formik.setFieldValue("amount", value);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="mb-6">
        <InputField
          label="Enter Amount"
          name="amount"
          type="text"
          value={formik.values.amount}
          onChange={handleAmountChange}
          onBlur={formik.handleBlur}
          placeholder="100"
          error={
            formik.touched.amount && formik.errors.amount
              ? formik.errors.amount
              : undefined
          }
          touched={formik.touched.amount}
          disabled={isLoading || formik.isSubmitting}
          className="pl-10 text-lg font-medium"
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
