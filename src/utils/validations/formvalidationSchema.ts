import * as Yup from "yup";

export const professionQualificationSchema = Yup.object().shape({
  experience: Yup.string()
    .required("Experience is required")
    .matches(/^[0-9]+$/, "Experience must be a number"),
  designation: Yup.string().required("Designation is required"),
  city: Yup.string().required("city is required"),
  preferredWorkLocation: Yup.string().required("location is required"),
  about: Yup.string()
    .required("About description is required")
    .min(10, "About must be at least 10 characters")
    .max(500, "About must be less than 500 characters"),
  certificates: Yup.array().min(1, "At least one certificate is required"),
  profilePhoto: Yup.mixed()
    .required("Profile photo is required")
    .test("fileSize", "File too large, max size is 5MB", (value) => {
      if (!value) return true;
      return value instanceof File && value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return true;
      return (
        value instanceof File &&
        ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      );
    }),
});

export const addDesignationSchema = Yup.object().shape({
  designation: Yup.string()
    .trim()
    .required("Designation name is required")
    .min(2, "Designation must be at least 2 characters")
    .max(50, "Designation must not exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s-]+$/,
      "Designation can only contain letters, numbers, spaces, and hyphens"
    ),
});
