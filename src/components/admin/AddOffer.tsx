import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { AddOfferProps } from "../../types/component.types";
import { addOfferSchema } from "../../utils/validations/formvalidationSchema";
import { getAllCategories } from "../../services/common.services";

export const AddOffer: React.FC<AddOfferProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  initialValues,
  isEditing = false,
}) => {
  const getErrorMessage = (error: any): string | undefined => {
    if (typeof error === "string") return error;
    if (Array.isArray(error)) return error[0];
    return undefined;
  };

  const getTouchedValue = (touched: any): boolean | undefined => {
    if (typeof touched === "boolean") return touched;
    return !!touched;
  };
  const [serviceOptions, setServiceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isFetchingServices, setIsFetchingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsFetchingServices(true);
      setServiceError(null);

      try {
        const servicesResponse = await getAllCategories();
        console.log("Services response:", servicesResponse);

        const serviceOptions = servicesResponse.data.map((service: any) => ({
          value: service._id,
          label: service.name,
        }));
        setServiceOptions(serviceOptions);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServiceError("Failed to load services. Please try again later.");
      } finally {
        setIsFetchingServices(false);
      }
    };

    fetchServices();
  }, []);

  const formik = useFormik({
    initialValues: initialValues || {
      title: "",
      description: "",
      offer_type: "",
      discount_type: "",
      discount_value: "",
      max_discount: "",
      min_booking_amount: "",
      service_id: "",
      valid_until: "",
    },
    validationSchema: addOfferSchema,
    onSubmit: async (values) => {
      try {
        const offerData = {
          title: values.title,
          description: values.description,
          offer_type: values.offer_type,
          discount_type: values.discount_type,
          discount_value: Number(values.discount_value),
          max_discount: values.max_discount
            ? Number(values.max_discount)
            : undefined,
          min_booking_amount: values.min_booking_amount
            ? Number(values.min_booking_amount)
            : undefined,
          service_id:
            values.offer_type === "service_category"
              ? values.service_id
              : undefined,
          valid_until: values.valid_until
            ? new Date(values.valid_until)
            : undefined,
        };

        if (isEditing && initialValues?._id) {
          offerData._id = initialValues._id;
        }

        await onSubmit?.(offerData);
      } catch (error) {
        console.error("Error submitting offer form:", error);
      }
    },
  });

  const offerTypeOptions = [
    { value: "global", label: "Global Offer" },
    { value: "service_category", label: "Service Category Offer" },
    { value: "first_time_user", label: "First Time User Offer" },
  ];

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "flat_amount", label: "Flat Amount (₹)" },
  ];

  const showServiceField = formik.values.offer_type === "service_category";

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="px-2 w-full max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <InputField
          label="Offer Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter offer title..."
          error={
            formik.touched.title && formik.errors.title
              ? getErrorMessage(formik.errors.title)
              : undefined
          }
          touched={getTouchedValue(formik.touched.title)}
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
          placeholder="Enter offer description..."
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {getErrorMessage(formik.errors.description)}
          </p>
        )}
      </div>

      <div className="mb-6 text-left">
        <SelectField
          label="Offer Type"
          name="offer_type"
          value={formik.values.offer_type || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={offerTypeOptions}
          placeholder="Select offer type"
          error={
            formik.touched.offer_type && formik.errors.offer_type
              ? getErrorMessage(formik.errors.offer_type)
              : undefined
          }
          touched={getTouchedValue(formik.touched.offer_type)}
        />
      </div>

      {showServiceField && (
        <div className="mb-6 text-left">
          <SelectField
            label="Select Service"
            name="service_id"
            value={formik.values.service_id || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={serviceOptions}
            placeholder={
              isFetchingServices ? "Loading services..." : "Select a service"
            }
            error={
              serviceError ||
              (formik.touched.service_id && formik.errors.service_id)
                ? serviceError || getErrorMessage(formik.errors.service_id)
                : undefined
            }
            touched={
              getTouchedValue(formik.touched.service_id) || !!serviceError
            }
            disabled={isFetchingServices}
          />
          {serviceOptions.length === 0 &&
            !isFetchingServices &&
            !serviceError && (
              <p className="mt-1 text-sm text-amber-600">
                No services available. Please add services first.
              </p>
            )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-left">
          <SelectField
            label="Discount Type"
            name="discount_type"
            value={formik.values.discount_type || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={discountTypeOptions}
            placeholder="Select discount type"
            error={
              formik.touched.discount_type && formik.errors.discount_type
                ? getErrorMessage(formik.errors.discount_type)
                : undefined
            }
            touched={getTouchedValue(formik.touched.discount_type)}
          />
        </div>

        <div>
          <InputField
            label={`Discount Value ${formik.values.discount_type === "percentage" ? "(%)" : "(₹)"}`}
            name="discount_value"
            type="number"
            value={formik.values.discount_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={
              formik.values.discount_type === "percentage"
                ? "Enter percentage..."
                : "Enter amount..."
            }
            error={
              formik.touched.discount_value && formik.errors.discount_value
                ? getErrorMessage(formik.errors.discount_value)
                : undefined
            }
            touched={getTouchedValue(formik.touched.discount_value)}
            style={{ appearance: "textfield" }}
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <InputField
            label="Maximum Discount (₹)"
            name="max_discount"
            type="number"
            value={formik.values.max_discount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter max discount amount..."
            disabled={formik.values.discount_type === "flat_amount"}
            error={
              formik.touched.max_discount && formik.errors.max_discount
                ? getErrorMessage(formik.errors.max_discount)
                : undefined
            }
            touched={getTouchedValue(formik.touched.max_discount)}
            style={{ appearance: "textfield" }}
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <InputField
            label="Minimum Booking Amount (₹)"
            name="min_booking_amount"
            type="number"
            value={formik.values.min_booking_amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter minimum booking amount..."
            error={
              formik.touched.min_booking_amount &&
              formik.errors.min_booking_amount
                ? getErrorMessage(formik.errors.min_booking_amount)
                : undefined
            }
            touched={getTouchedValue(formik.touched.min_booking_amount)}
            style={{ appearance: "textfield" }}
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="mb-6">
        <InputField
          label="Valid Until"
          name="valid_until"
          type="date"
          value={formik.values.valid_until}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Select expiry date"
          error={
            formik.touched.valid_until && formik.errors.valid_until
              ? getErrorMessage(formik.errors.valid_until)
              : undefined
          }
          touched={getTouchedValue(formik.touched.valid_until)}
        />
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
          disabled={formik.isSubmitting || isFetchingServices}
          className="py-2 px-4 w-24"
        >
          {isEditing ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};
