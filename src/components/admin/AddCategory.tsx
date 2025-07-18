import React from "react";
import { useFormik } from "formik";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import { AddCategoryProps } from "../../types/component.types";
import { addCategorySchema } from "../../utils/validations/formvalidationSchema";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";
import { Upload, X } from "lucide-react";

export const AddCategory: React.FC<AddCategoryProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  initialValues,
  isEditing = false,
}) => {
  const formik = useFormik({
    initialValues: initialValues || {
      categoryName: "",
      categoryImage: null as File | null,
    },
    validationSchema: addCategorySchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.categoryName);
        if (values.categoryImage && values.categoryImage instanceof File) {
          formData.append("image", values.categoryImage);
        }
        if (isEditing && initialValues?._id) {
          formData.append("categoryId", initialValues._id);
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
      formik.setFieldValue("categoryImage", files[0]);
    }
  };

  const removeImage = () => {
    formik.setFieldValue("categoryImage", null);
    const fileInput = document.getElementById(
      "category-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const imagePreview = formik.values.categoryImage
    ? formik.values.categoryImage instanceof File
      ? URL.createObjectURL(formik.values.categoryImage)
      : buildCloudinaryUrl(formik.values.categoryImage as string)
    : undefined;

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-6">
        <InputField
          label="Category Name"
          name="categoryName"
          value={formik.values.categoryName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter category name"
          error={
            formik.touched.categoryName && formik.errors.categoryName
              ? formik.errors.categoryName
              : undefined
          }
          touched={formik.touched.categoryName}
        />
      </div>

      <div className="mb-6 text-left">
        <label
          htmlFor="category-image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category Image
        </label>

        <div
          className={`border-2 border-dashed ${
            formik.touched.categoryImage && formik.errors.categoryImage
              ? "border-red-300"
              : "border-gray-300"
          } rounded-md p-4`}
        >
          {imagePreview ? (
            <div className="mb-2 relative">
              <img
                src={imagePreview}
                alt="Category preview"
                className="h-40 object-contain mx-auto"
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
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-gray-100 p-3 mb-2">
                <Upload className="h-8 w-8 text-gray-500" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Drag & Drop or{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() =>
                    document.getElementById("category-image")?.click()
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
            id="category-image"
            name="categoryImage"
            className="hidden"
            accept=".jpeg,.jpg,.png,.pdf"
            onChange={handleFileChange}
            onBlur={formik.handleBlur}
          />
        </div>

        {formik.touched.categoryImage && formik.errors.categoryImage && (
          <p className="mt-1 text-sm text-red-600">
            {formik.errors.categoryImage}
          </p>
        )}
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
          {isEditing ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};
