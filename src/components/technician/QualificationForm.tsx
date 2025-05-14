import React, { useState, useEffect } from "react";
import { Upload, MapPin, Briefcase, Clock, User, FileText, Camera } from "lucide-react";
import { useFormik } from "formik";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import { getJobDesignations } from "../../services/technician.services";
import { QualificationFormProps } from "../../types/component.types";
import { professionQualificationSchema } from "../../utils/validations/formvalidationSchema";
import { showToast } from "../../utils/toast";
import { useOlaMap } from "../../hooks/useOlaMap";
import { MapLocation } from "../../types/map.types";

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
      currentLocation: {
        latitude: null as number | null,
        longitude: null as number | null,
        address: "",
      },
    },
    validationSchema: professionQualificationSchema,
    onSubmit: async (values) => {
      try {
        console.log("values:", values);
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

  const {
    location,
    isLoadingLocation,
    locationError,
    mapContainerRef,
    getCurrentLocation,
    isMapReady,
  } = useOlaMap({
    onLocationChange: (newLocation: MapLocation) => {
      formik.setFieldValue("currentLocation.latitude", newLocation.latitude);
      formik.setFieldValue("currentLocation.longitude", newLocation.longitude);
      formik.setFieldValue(
        "currentLocation.address",
        newLocation.address || ""
      );
    },
  });

  useEffect(() => {
    const fetchDesignations = async () => {
      setIsLoading(true);
      try {
        const designationNames = await getJobDesignations();
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
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        Professional Qualifications
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                Job Designation
              </label>
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
                className="w-full h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                Years of Experience
              </label>
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
                className="w-full h-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            About You
          </label>
          <textarea
            name="about"
            value={formik.values.about}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Tell us about your experience and expertise"
            className={`w-full px-4 py-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.about && formik.errors.about
                ? "border-red-500"
                : "border-gray-300"
            }`}
            required
          />
          {formik.touched.about && formik.errors.about && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.about}</p>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Profile & Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Camera className="w-4 h-4 mr-2 text-gray-500" />
                Profile Photo
              </label>
              <div className="mt-1">
                {formik.values.profilePhoto ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formik.values.profilePhoto)}
                      alt="Profile preview"
                      className="h-40 w-40 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("profilePhoto")}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white h-6 w-6 rounded-full flex items-center justify-center shadow-md"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
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

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Current Location
              </label>
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-2 mb-3"
              >
                <MapPin className="h-4 w-4" />
                {isLoadingLocation
                  ? "Getting Location..."
                  : "Get Current Location"}
              </Button>

              {location && (
                <div className="space-y-3">
                  <div
                    ref={mapContainerRef}
                    id="ola-map-container"
                    className="w-full rounded-lg border border-gray-300 relative overflow-hidden shadow-sm"
                    style={{ height: "280px", minHeight: "280px" }}
                  >

                    {!isMapReady && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                          Loading map...
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          Selected Location:
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {location.address ||
                            `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Coordinates: {location.latitude.toFixed(6)},{" "}
                          {location.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {locationError && (
                <p className="mt-2 text-sm text-red-600">{locationError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Professional Certificates
          </h3>
          
          <div className="mt-1">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
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
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 truncate">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("certificates", index)}
                        className="text-red-500 hover:text-red-700 text-lg font-bold"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-8 py-3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting || isLoading}
            variant="primary"
            isLoading={formik.isSubmitting}
            className="px-8 py-3"
          >
            Submit for Verification
          </Button>
        </div>
      </form>
    </div>
  );
};