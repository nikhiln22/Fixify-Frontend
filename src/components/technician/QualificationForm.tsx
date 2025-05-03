import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useFormik } from "formik";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import { getJobDesignations } from "../../services/technician.services";
import { QualificationFormProps } from "../../types/component.types";
import { professionQualificationSchema } from "../../utils/validations/formvalidationSchema";
import { showToast } from "../../utils/toast";

export const QualificationForm: React.FC<QualificationFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [designations, setDesignations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      experience: "",
      designation: "",
      about: "",
      certificates: [] as File[],
      profilePhoto: null as File | null,
    },
    validationSchema: professionQualificationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Error submitting form:", error);
        showToast({
          message: "Failed to submit qualification. Please try again.",
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    const fetchDesignations = async () => {
      setIsLoading(true);
      try {
        const designationNames = await getJobDesignations();
        console.log(
          "job designations from the qualification component:",
          designationNames
        );
        setDesignations(designationNames);
      } catch (err) {
        console.error("Error fetching designations:", err);
        showToast({
          message: "Failed to load job designations. Please try again later.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesignations();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files) {
      if (name === "certificates") {
        formik.setFieldValue(name, Array.from(files));
      } else {
        formik.setFieldValue(name, files[0]);
      }
    }
  };

  const removeFile = (type: string, index?: number) => {
    if (type === "certificates" && index !== undefined) {
      const updatedCertificates = [...formik.values.certificates];
      updatedCertificates.splice(index, 1);
      formik.setFieldValue("certificates", updatedCertificates);
    } else if (type === "profilePhoto") {
      formik.setFieldValue("profilePhoto", null);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        Professional Qualifications
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-wrap -mx-4">
          {/* Left section with designation and experience */}
          <div className="w-1/2 px-4">
            <div className="mb-6">
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Job Designation
                </span>
              </div>
              <SelectField
                label=""
                name="designation"
                value={formik.values.designation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={
                  isLoading
                    ? [{ value: "", label: "Loading designations..." }]
                    : designations.map((designationName) => ({
                        value: designationName,
                        label: designationName,
                      }))
                }
                placeholder="Select your specialization"
                required={true}
                disabled={isLoading}
                error={
                  formik.touched.designation && formik.errors.designation
                    ? formik.errors.designation
                    : undefined
                }
                touched={formik.touched.designation}
                className="w-full max-w-md"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Years of Experience
                </span>
              </div>
              <InputField
                label=""
                name="experience"
                type="text"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 5"
                required={true}
                error={
                  formik.touched.experience && formik.errors.experience
                    ? formik.errors.experience
                    : undefined
                }
                touched={formik.touched.experience}
                className="w-full max-w-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Right column for profile photo */}
          <div className="w-1/2 px-4 flex justify-end">
            <div className="w-40">
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Profile Photo
                </span>
              </div>
              <div className="mt-1">
                {formik.values.profilePhoto ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formik.values.profilePhoto)}
                      alt="Profile preview"
                      className="h-40 w-40 object-cover rounded border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("profilePhoto")}
                      className="absolute top-0 right-0 bg-red-500 text-white h-6 w-6 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="h-40 w-40 border border-gray-300 rounded flex items-center justify-center bg-gray-50">
                    <label
                      htmlFor="profilePhoto"
                      className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center"
                    >
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">
                        Add photo
                      </span>
                      <input
                        id="profilePhoto"
                        name="profilePhoto"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                        onBlur={formik.handleBlur}
                      />
                    </label>
                  </div>
                )}
              </div>
              {formik.touched.profilePhoto && formik.errors.profilePhoto && (
                <p className="text-sm text-red-600">
                  {formik.errors.profilePhoto}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* About You section - full width */}
        <div className="w-full px-4 mb-6">
          <div className="flex items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              About You
            </span>
          </div>
          <textarea
            name="about"
            value={formik.values.about}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Tell us about your experience and expertise"
            className={`w-full px-3 py-2 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.about && formik.errors.about
                ? "border-red-500"
                : "border-gray-300"
            }`}
            required
          />
          {formik.touched.about && formik.errors.about && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.about}
            </p>
          )}
        </div>

        {/* Professional Certificates section - full width */}
        <div className="w-full px-4 mt-2">
          <div className="mb-6">
            <div className="flex items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                Professional Certificates
              </span>
            </div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-gray-300 rounded-md bg-gray-50">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="certificates"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload certificates</span>
                    <input
                      id="certificates"
                      name="certificates"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      onBlur={formik.handleBlur}
                      multiple
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG up to 10MB each
                </p>
              </div>
            </div>

            {formik.touched.certificates && formik.errors.certificates && (
              <p className="mt-1 text-sm text-red-600">
                {typeof formik.errors.certificates === "string" &&
                  formik.errors.certificates}
              </p>
            )}

            {formik.values.certificates.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Certificates:
                </h4>
                <ul className="space-y-2">
                  {formik.values.certificates.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-300"
                    >
                      <span className="text-sm text-gray-600 truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("certificates", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isLoading}
              variant="primary"
              isLoading={formik.isSubmitting}
              className="px-6 py-2"
            >
              Submit for Verification
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};