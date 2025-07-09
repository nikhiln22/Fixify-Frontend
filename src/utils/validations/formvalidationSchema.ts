import * as Yup from "yup";

export const professionQualificationSchema = Yup.object().shape({
  experience: Yup.string()
    .required("Experience is required")
    .matches(/^[0-9]+$/, "Experience must be a number"),
  designation: Yup.string().required("Designation is required"),
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

export const addCategorySchema = Yup.object().shape({
  categoryName: Yup.string()
    .trim()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must not exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s-]+$/,
      "Category name can only contain letters, numbers, spaces, and hyphens"
    ),
  categoryImage: Yup.mixed()
    .required("Category image is required")
    .test("fileSize", "File too large, max size is 10MB", (value) => {
      if (typeof value === "string" || !value) return true;
      return value instanceof File && value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (typeof value === "string" || !value) return true;
      return (
        value instanceof File &&
        ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
          value.type
        )
      );
    }),
});

export const addServiceSchema = Yup.object().shape({
  serviceName: Yup.string()
    .trim()
    .required("Service name is required")
    .min(2, "Service name must be at least 2 characters")
    .max(50, "Service name must not exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s-]+$/,
      "Service name can only contain letters, numbers, spaces, and hyphens"
    ),

  servicePrice: Yup.number()
    .required("Service price is required")
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .test(
      "maxDigits",
      "Price cannot exceed 6 digits",
      (value) => !value || String(value).replace(/[.-]/g, "").length <= 6
    ),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  categoryId: Yup.string().required("Category selection is required"),
  designationId: Yup.string().required("Job designation is required"),

  serviceImage: Yup.mixed()
    .required("Service image is required")
    .test("fileSize", "File too large, max size is 10MB", (value) => {
      if (typeof value === "string" || !value) return true;
      return value instanceof File && value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (typeof value === "string" || !value) return true;
      return (
        value instanceof File &&
        ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
          value.type
        )
      );
    }),
});

export const addMoneySchema = Yup.object().shape({
  amount: Yup.string()
    .required("Amount is required")
    .test("is-number", "Please enter a valid amount", (value) => {
      if (!value) return false;
      const numValue = parseFloat(value);
      return !isNaN(numValue) && isFinite(numValue);
    })
    .test("min-amount", "Minimum amount is ₹100", (value) => {
      if (!value) return false;
      const numValue = parseFloat(value);
      return numValue >= 100;
    })
    .test("max-amount", "Maximum amount is ₹1,000", (value) => {
      if (!value) return false;
      const numValue = parseFloat(value);
      return numValue <= 100000;
    })
    .test(
      "decimal-places",
      "Amount can have maximum 2 decimal places",
      (value) => {
        if (!value) return false;
        const decimalPlaces = (value.split(".")[1] || "").length;
        return decimalPlaces <= 2;
      }
    ),
});

export const profileCardSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  Designation: Yup.string().when("$role", {
    is: "technician",
    then: (schema) =>
      schema
        .trim()
        .required("Designation is required")
        .min(2, "Designation must be at least 2 characters")
        .max(50, "Designation must not exceed 50 characters")
        .matches(
          /^[a-zA-Z0-9\s-]+$/,
          "Designation can only contain letters, numbers, spaces, and hyphens"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  yearsOfExperience: Yup.number().when("$role", {
    is: "technician",
    then: (schema) =>
      schema
        .required("Years of experience is required")
        .typeError("Experience must be a number")
        .integer("Experience must be a whole number")
        .min(0, "Experience cannot be negative")
        .max(50, "Experience cannot exceed 50 years"),
    otherwise: (schema) => schema.notRequired(),
  }),

  image: Yup.mixed()
    .nullable()
    .test("fileSize", "File too large, max size is 5MB", (value) => {
      if (!value || typeof value === "string") return true;
      return value instanceof File && value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || typeof value === "string") return true;
      return (
        value instanceof File &&
        ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      );
    }),
});

export const addOfferSchema = Yup.object({
  title: Yup.string()
    .required("Offer title is required")
    .min(3, "Title must be at least 3 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  offer_type: Yup.string()
    .required("Offer type is required")
    .oneOf(
      ["global", "service_category", "first_time_user"],
      "Invalid offer type"
    ),

  discount_type: Yup.string()
    .required("Discount type is required")
    .oneOf(["percentage", "flat_amount"], "Invalid discount type"),

  discount_value: Yup.number()
    .required("Discount value is required")
    .positive("Discount value must be positive")
    .when("discount_type", {
      is: "percentage",
      then: (schema) => schema.max(100, "Percentage cannot exceed 100%"),
    }),

  max_discount: Yup.number()
    .positive("Maximum discount must be positive")
    .nullable(),

  min_booking_amount: Yup.number()
    .positive("Minimum booking amount must be positive")
    .nullable(),

  valid_until: Yup.date()
    .required("Valid until date is required")
    .min(new Date(), "Valid until date must be in the future"),

  service_id: Yup.string().when("offer_type", {
    is: "service_category",
    then: (schema) =>
      schema.required(
        "Service selection is required for service category offers"
      ),
  }),
});

export const addCouponSchema = Yup.object().shape({
  code: Yup.string()
    .required("Coupon code is required")
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be at most 20 characters"),
  title: Yup.string()
    .required("Coupon title is required")
    .min(3, "Coupon title must be at least 3 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  discount_type: Yup.string()
    .required("Discount type is required")
    .oneOf(["percentage", "flat_amount"], "Invalid discount type"),
  discount_value: Yup.number()
    .required("Discount value is required")
    .positive("Discount value must be positive"),
  max_discount: Yup.number()
    .positive("Maximum discount must be positive")
    .when("discount_type", {
      is: "percentage",
      then: (schema) =>
        schema.required("Maximum discount is required for percentage discount"),
      otherwise: (schema) => schema.notRequired(),
    }),
  min_booking_amount: Yup.number().positive(
    "Minimum booking amount must be positive"
  ),
  valid_until: Yup.date()
    .required("Valid until date is required")
    .min(new Date(), "Valid until date must be in the future"),
});
