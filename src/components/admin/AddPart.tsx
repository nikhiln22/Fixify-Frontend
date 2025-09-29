import React from "react";
import { useFormik } from "formik";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import { AddPartProps } from "../../types/component.types";
import { addPartSchema } from "../../utils/validations/formvalidationSchema";

export const AddPart: React.FC<AddPartProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  initialValues,
  isEditing = false,
  serviceOptions,
}) => {
  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      description: "",
      price: "",
      services: [],
    },
    validationSchema: addPartSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit?.(values);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="px-2 w-full max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <InputField
          label="Part Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter part name"
          error={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : undefined
          }
          touched={formik.touched.name}
        />
      </div>

      <div className="mb-6">
        <InputField
          label="Price (₹)"
          name="price"
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter part price"
          error={
            formik.touched.price && formik.errors.price
              ? formik.errors.price
              : undefined
          }
          touched={formik.touched.price}
          style={{ appearance: "textfield" }}
          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <div className="mb-6 text-left">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className={`w-full px-3 py-1.5 border ${
            formik.touched.description && formik.errors.description
              ? "border-red-300"
              : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter part description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {formik.errors.description}
          </p>
        )}
      </div>

      <div className="mb-6 text-left">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Services
        </label>
        <div
          className={`border ${
            formik.touched.services && formik.errors.services
              ? "border-red-300"
              : "border-gray-300"
          } rounded-md p-3 bg-white max-h-48 overflow-y-auto`}
        >
          {serviceOptions && serviceOptions.length > 0 ? (
            <div className="space-y-2">
              {serviceOptions
                .filter((option) => option.value !== "")
                .map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formik.values.services.includes(option.value)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const currentServices = formik.values.services;

                        if (isChecked) {
                          formik.setFieldValue("services", [
                            ...currentServices,
                            option.value,
                          ]);
                        } else {
                          formik.setFieldValue(
                            "services",
                            currentServices.filter((id) => id !== option.value)
                          );
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 select-none">
                      {option.label}
                    </span>
                  </label>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-4 text-center">
              No services available
            </p>
          )}
        </div>

        {formik.touched.services && formik.errors.services && (
          <p className="mt-1 text-sm text-red-600">
            {formik.errors.services?.toString()}
          </p>
        )}

        {serviceOptions?.length === 0 && (
          <p className="mt-1 text-sm text-amber-600">
            No services available. Please add services first.
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          type="button"
          className="py-2 px-4 w-24"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading || formik.isSubmitting}
          disabled={formik.isSubmitting}
          className="py-2 px-4 w-24"
        >
          {isEditing ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};
