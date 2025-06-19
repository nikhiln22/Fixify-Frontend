import React, { useState, useRef, useEffect } from "react";
import { Edit, Save, X, Upload } from "lucide-react";
import { useFormik } from "formik";
import Button from "../common/Button";
import { ProfileCardProps } from "../../types/component.types";
import { profileCardSchema } from "../../utils/validations/formvalidationSchema";
import { showToast } from "../../utils/toast";

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  phone,
  image,
  role,
  Designation,
  yearsOfExperience,
  isEditable = true,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: name || "",
      phone: phone || "",
      image: image,
      Designation: Designation || "",
      yearsOfExperience: yearsOfExperience || 0,
    },
    validationSchema: profileCardSchema,
    validationContext: { role },
    validate: isEditing ? undefined : () => ({}),
    onSubmit: async (values) => {
      if (!isEditing || !onSave) {
        return;
      }

      try {

        const formData = new FormData();

        formData.append("username", values.name || "");
        formData.append("phone", values.phone?.toString() || "");

        if (selectedFile && selectedFile instanceof File) {
          formData.append("image", selectedFile);
        } else if (imageRemoved) {
          formData.append("removeImage", "true");
        }

        if (role === "technician") {
          formData.append("designation", values.Designation || "");
          formData.append(
            "yearsOfExperience",
            values.yearsOfExperience?.toString() || "0"
          );
        }

        await onSave(formData);

        setIsEditing(false);
        setImageRemoved(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Save failed:", error);
        showToast({
          message: "Failed to update profile. Please try again.",
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (!isEditing) {
      formik.setValues({
        name: name || "",
        phone: phone || "",
        image: image,
        Designation: Designation || "",
        yearsOfExperience: yearsOfExperience || 0,
      });
      formik.setTouched({});
      formik.setErrors({});
    }
  }, [name, phone, image, Designation, yearsOfExperience, isEditing]);

  const currentPhoto = isEditing
    ? imageRemoved
      ? null
      : formik.values.image
    : image;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Edit button clicked");
    setIsEditing(true);
    formik.setValues({
      name: name || "",
      phone: phone || "",
      image: image,
      Designation: Designation || "",
      yearsOfExperience: yearsOfExperience || 0,
    });
    setSelectedFile(null);
    setImageRemoved(false);
    formik.setTouched({});
    formik.setErrors({});
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Cancel button clicked");
    setIsEditing(false);
    formik.setValues({
      name: name || "",
      phone: phone || "",
      image: image,
      Designation: Designation || "",
      yearsOfExperience: yearsOfExperience || 0,
    });
    setSelectedFile(null);
    setImageRemoved(false);
    formik.setTouched({});
    formik.setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save button clicked, submitting form");
    formik.handleSubmit(e);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast({
          message: "Image size should be less than 5MB",
          type: "error",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        showToast({
          message: "Please select a valid image file",
          type: "error",
        });
        return;
      }

      setSelectedFile(file);
      setImageRemoved(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        formik.setFieldValue("image", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoRemove = () => {
    formik.setFieldValue("image", undefined);
    setSelectedFile(null);
    setImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden w-full">
      <div className="p-8">
        <form onSubmit={handleSaveClick}>
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0 mr-8 relative">
              <div
                className={`w-40 h-48 rounded-xl border border-gray-200 ${
                  isEditing && isEditable
                    ? "cursor-pointer hover:border-blue-400"
                    : ""
                }`}
                onClick={isEditing && isEditable ? triggerFileInput : undefined}
              >
                {currentPhoto ? (
                  <div className="relative w-full h-full">
                    <img
                      src={currentPhoto}
                      alt={`${name}'s profile`}
                      className="w-full h-full rounded-xl object-cover"
                    />
                    {isEditing && isEditable && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoRemove();
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-2">
                      <Upload className="w-8 h-8 text-gray-500" />
                    </div>
                    {isEditing && isEditable && (
                      <p className="text-sm text-gray-500 text-center px-2">
                        Click to upload photo
                      </p>
                    )}
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="flex-grow">
              <div className="flex items-center justify-between mb-6">
                {isEditing ? (
                  <div className="flex-grow mr-4">
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`text-2xl font-semibold text-gray-800 bg-transparent border-b-2 focus:outline-none ${
                        formik.touched.name && formik.errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-black"
                      }`}
                      placeholder="Enter name"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {name}
                  </h3>
                )}

                {isEditable && (
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          type="submit"
                          variant="primary"
                          className="px-4 py-2 flex items-center gap-2"
                          disabled={formik.isSubmitting}
                          isLoading={formik.isSubmitting}
                        >
                          <Save className="w-4 h-4" />
                          {formik.isSubmitting ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 flex items-center gap-2"
                          disabled={formik.isSubmitting}
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleEditClick}
                        className="px-4 py-2 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-500 text-base w-32">Email:</span>
                  <span className="text-gray-800 text-base font-medium">
                    {email}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 text-base w-32">
                    Phone no:
                  </span>
                  {isEditing ? (
                    <div className="flex-grow">
                      <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`text-gray-800 text-base font-medium bg-transparent border-b focus:outline-none ${
                          formik.touched.phone && formik.errors.phone
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-black"
                        }`}
                        placeholder="Enter phone number"
                        disabled={formik.isSubmitting}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-800 text-base font-medium">
                      {phone}
                    </span>
                  )}
                </div>

                {role === "technician" && (
                  <div className="flex items-center">
                    <span className="text-gray-500 text-base w-32">
                      Experience:
                    </span>
                    {isEditing ? (
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formik.values.yearsOfExperience || ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`text-gray-800 text-base font-medium bg-transparent border-b focus:outline-none w-20 ${
                              formik.touched.yearsOfExperience &&
                              formik.errors.yearsOfExperience
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-black"
                            }`}
                            placeholder="0"
                            min="0"
                            max="50"
                            disabled={formik.isSubmitting}
                          />
                          <span className="text-gray-800 text-base font-medium ml-2">
                            years
                          </span>
                        </div>
                        {formik.touched.yearsOfExperience &&
                          formik.errors.yearsOfExperience && (
                            <p className="mt-1 text-sm text-red-600">
                              {formik.errors.yearsOfExperience}
                            </p>
                          )}
                      </div>
                    ) : (
                      <span className="text-gray-800 text-base font-medium">
                        {yearsOfExperience || 0} years
                      </span>
                    )}
                  </div>
                )}

                {role === "technician" && (
                  <div className="flex items-center">
                    <span className="text-gray-500 text-base w-32">
                      Designation:
                    </span>
                    {isEditing ? (
                      <div className="flex-grow">
                        <input
                          type="text"
                          name="Designation"
                          value={formik.values.Designation || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`text-gray-800 text-base font-medium bg-transparent border-b focus:outline-none ${
                            formik.touched.Designation &&
                            formik.errors.Designation
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-black"
                          }`}
                          placeholder="Enter designation"
                          disabled={formik.isSubmitting}
                        />
                        {formik.touched.Designation &&
                          formik.errors.Designation && (
                            <p className="mt-1 text-sm text-red-600">
                              {formik.errors.Designation}
                            </p>
                          )}
                      </div>
                    ) : (
                      <span className="text-gray-800 text-base font-medium">
                        {Designation || "Not specified"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};