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
      "Designation can only contain letters, numbers, spaces, and hyphens",
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
      "Category name can only contain letters, numbers, spaces, and hyphens",
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
          value.type,
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
      "Service name can only contain letters, numbers, spaces, and hyphens",
    ),

  servicePrice: Yup.number()
    .required("Service price is required")
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .test(
      "maxDigits",
      "Price cannot exceed 6 digits",
      (value) => !value || String(value).replace(/[.-]/g, "").length <= 6,
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
          value.type,
        )
      );
    }),
});


export const timeSlotFormSchema = Yup.object().shape({
  startDate: Yup.date()
    .required("Start date is required")
    .nullable()
    .typeError("Please select a valid start date")
    .test(
      "is-future-date",
      "Start date must be from tomorrow onwards",
      function (value) {
        if (!value) return true; 
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= tomorrow;
      }
    ),

  endDate: Yup.date()
    .required("End date is required")
    .nullable()
    .typeError("Please select a valid end date")
    .test(
      "is-after-start-date",
      "End date must be same as or after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true; 
        const endDateOnly = new Date(value);
        endDateOnly.setHours(0, 0, 0, 0);
        const startDateOnly = new Date(startDate);
        startDateOnly.setHours(0, 0, 0, 0);
        return endDateOnly >= startDateOnly;
      }
    )
    .test(
      "is-future-date",
      "End date must be from tomorrow onwards",
      function (value) {
        if (!value) return true; 
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= tomorrow;
      }
    ),

  startTime: Yup.string()
    .required("Start time is required")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please select a valid start time"
    )
    .test(
      "valid-start-time-range",
      "Start time must be between 6:00 AM and 2:00 PM",
      function (value) {
        if (!value) return true; 
        const [hours] = value.split(':').map(Number);
        return hours >= 6 && hours <= 14;
      }
    ),

  endTime: Yup.string()
    .required("End time is required")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please select a valid end time"
    )
    .test(
      "valid-end-time-range",
      "End time must be between 2:00 PM and 10:00 PM",
      function (value) {
        if (!value) return true; 
        const [hours] = value.split(':').map(Number);
        return hours >= 14 && hours <= 22;
      }
    )
    .test(
      "end-time-after-start-time",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        if (!value || !startTime) return true;
        
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = value.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        return endTotalMinutes > startTotalMinutes;
      }
    )
    .test(
      "minimum-duration",
      "There must be at least 1 hour difference between start and end time",
      function (value) {
        const { startTime } = this.parent;
        if (!value || !startTime) return true; 
        
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = value.split(':').map(Number);
        
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        
        return (endTotalMinutes - startTotalMinutes) >= 60;
      }
    ),
});