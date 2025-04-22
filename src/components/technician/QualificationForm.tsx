import React, { useState, useEffect } from "react";
import { Upload, Calendar, Award, Briefcase } from "lucide-react";
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
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Professional Qualifications
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <SelectField
            label="Job Designation"
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
            icon={<Briefcase className="h-5 w-5 mr-2 text-gray-600" />}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-1">
            <Calendar className="h-5 w-5 mr-2 text-gray-600" />
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
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-1">
            <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">About You</span>
          </div>
          <InputField
            label=""
            name="about"
            type="text"
            value={formik.values.about}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Tell us about your experience and expertise"
            required={true}
            error={
              formik.touched.about && formik.errors.about
                ? formik.errors.about
                : undefined
            }
            touched={formik.touched.about}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            <div className="flex items-center mb-1">
              <Award className="h-5 w-5 mr-2 text-gray-600" />
              Professional Certificates
            </div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
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
          </label>

          {formik.touched.certificates && formik.errors.certificates && (
            <p className="mt-1 text-sm text-red-600">
              {typeof formik.errors.certificates === "string" &&
                formik.errors.certificates}
            </p>
          )}

          {formik.values.certificates.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Certificates:
              </h4>
              <ul className="space-y-2">
                {formik.values.certificates.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
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

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Profile Photo
            <div className="mt-1 flex items-center">
              {formik.values.profilePhoto ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(formik.values.profilePhoto)}
                    alt="Profile preview"
                    className="h-32 w-32 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile("profilePhoto")}
                    className="absolute top-0 right-0 rounded-full bg-red-500 text-white h-6 w-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-full flex items-center justify-center">
                  <label
                    htmlFor="profilePhoto"
                    className="cursor-pointer text-center"
                  >
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 4v16m8-8H4"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Add photo</span>
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
          </label>
          {formik.touched.profilePhoto && formik.errors.profilePhoto && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.profilePhoto}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting || isLoading}
            variant="primary"
            isLoading={formik.isSubmitting}
          >
            Submit for Verification
          </Button>
        </div>
      </form>
    </div>
  );
};
