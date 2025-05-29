import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { Upload, X } from "lucide-react";
import { AddServiceProps } from "../../types/component.types";
import { addServiceSchema } from "../../utils/validations/formvalidationSchema";
import { getAllCategories } from "../../services/common.services";

export const AddService: React.FC<AddServiceProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  initialValues,
  isEditing = false,
}) => {
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetchingCategories(true);
      setCategoryError(null);

      try {
        const response = await getAllCategories();
        console.log("response from the add category form component:", response);

        const options = response.data.map((category: any) => ({
          value: category._id,
          label: category.name,
        }));

        setCategoryOptions(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoryError("Failed to load categories. Please try again later.");
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: initialValues || {
      serviceName: "",
      servicePrice: "",
      description: "",
      serviceImage: null as File | null,
      categoryId: "",
    },
    validationSchema: addServiceSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.serviceName || "");
        formData.append("price", values.servicePrice?.toString() || "0");
        formData.append("description", values.description || "");
        formData.append("categoryId", values.categoryId || "");

        if (values.serviceImage && values.serviceImage instanceof File) {
          formData.append("image", values.serviceImage);
        }

        if (isEditing && initialValues?._id) {
          formData.append("serviceId", initialValues._id);
        }

        await onSubmit?.(formData);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      formik.setFieldValue("serviceImage", files[0]);
    }
  };

  const removeImage = () => {
    formik.setFieldValue("serviceImage", null);
    const fileInput = document.getElementById(
      "service-image",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const imagePreview = formik.values.serviceImage
    ? formik.values.serviceImage instanceof File
      ? URL.createObjectURL(formik.values.serviceImage)
      : formik.values.serviceImage
    : undefined;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="px-2 w-full max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <InputField
          label="Service Name"
          name="serviceName"
          value={formik.values.serviceName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter service name"
          error={
            formik.touched.serviceName && formik.errors.serviceName
              ? formik.errors.serviceName
              : undefined
          }
          touched={formik.touched.serviceName}
        />
      </div>

      <div className="mb-6">
        <InputField
          label="Service Price"
          name="servicePrice"
          value={formik.values.servicePrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter service price"
          error={
            formik.touched.servicePrice && formik.errors.servicePrice
              ? formik.errors.servicePrice
              : undefined
          }
          touched={formik.touched.servicePrice}
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
          placeholder="Enter service description"
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
        <SelectField
          label="Select Category"
          name="categoryId"
          value={formik.values.categoryId || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={categoryOptions}
          placeholder={
            isFetchingCategories ? "Loading categories..." : "Select a category"
          }
          error={
            categoryError ||
            (formik.touched.categoryId && formik.errors.categoryId)
              ? categoryError || formik.errors.categoryId?.toString()
              : undefined
          }
          touched={formik.touched.categoryId || !!categoryError}
          disabled={isFetchingCategories}
        />
        {categoryOptions.length === 0 &&
          !isFetchingCategories &&
          !categoryError && (
            <p className="mt-1 text-sm text-amber-600">
              No categories available. Please add categories first.
            </p>
          )}
      </div>

      <div className="mb-6 text-left">
        <label
          htmlFor="service-image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Service Image
        </label>

        <div
          className={`border-2 border-dashed ${
            formik.touched.serviceImage && formik.errors.serviceImage
              ? "border-red-300"
              : "border-gray-300"
          } rounded-md p-3`}
        >
          {imagePreview ? (
            <div className="mb-2 relative">
              <img
                src={imagePreview}
                alt="Service preview"
                className="h-32 object-contain mx-auto"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-5">
              <div className="rounded-full bg-gray-100 p-2 mb-2">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Drag & Drop or{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() =>
                    document.getElementById("service-image")?.click()
                  }
                >
                  choose file
                </span>{" "}
                to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: .jpeg, .jpg, .png, .pdf
              </p>
            </div>
          )}

          <input
            type="file"
            id="service-image"
            name="serviceImage"
            className="hidden"
            accept=".jpeg,.jpg,.png,.pdf"
            onChange={handleFileChange}
            onBlur={formik.handleBlur}
          />
        </div>

        {formik.touched.serviceImage && formik.errors.serviceImage && (
          <p className="mt-1 text-sm text-red-600">
            {formik.errors.serviceImage}
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
          disabled={formik.isSubmitting || isFetchingCategories}
          className="py-2 px-4 w-24"
        >
          {isEditing ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};
