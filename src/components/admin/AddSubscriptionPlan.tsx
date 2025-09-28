import React from "react";
import { useFormik } from "formik";
import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import { ISubscriptionPlan } from "../../models/subscriptionPlan";
import { subscriptionPlanSchema } from "../../utils/validations/formvalidationSchema";
import { SubscriptionPlanFormDto } from "../../types/subscription.types";

interface AddSubscriptionPlanProps {
  onCancel: () => void;
  onSubmit: (data: SubscriptionPlanFormDto) => Promise<void>;
  isLoading?: boolean;
  initialValues?: Partial<ISubscriptionPlan>;
  isEditing?: boolean;
}

const getErrorMessage = (
  error: string | string[] | undefined
): string | undefined => {
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error[0];
  return undefined;
};

const getTouchedValue = (touched: boolean | undefined): boolean | undefined => {
  if (typeof touched === "boolean") return touched;
  return !!touched;
};

const profileBoostOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export const AddSubscriptionPlan: React.FC<AddSubscriptionPlanProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  initialValues,
  isEditing = false,
}) => {
  const handlePlanNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    formik.setFieldValue("planName", uppercaseValue);
  };

  console.log("Initial Values received:", initialValues);
  console.log("Is editing:", isEditing);

  const formik = useFormik({
    initialValues: {
      planName: initialValues?.planName ?? "",
      price:
        initialValues?.price !== undefined
          ? initialValues.price.toString()
          : "",
      commissionRate:
        initialValues?.commissionRate !== undefined
          ? initialValues.commissionRate.toString()
          : "",
      WalletCreditDelay:
        initialValues?.WalletCreditDelay !== undefined
          ? initialValues.WalletCreditDelay.toString()
          : "",
      profileBoost: initialValues?.profileBoost === true ? "true" : "false",
      durationInMonths:
        initialValues?.durationInMonths !== undefined
          ? initialValues.durationInMonths.toString()
          : "",
      description: initialValues?.description ?? "",
    },
    validationSchema: subscriptionPlanSchema,
    onSubmit: async (values) => {
      try {
        const subscriptionPlanData: SubscriptionPlanFormDto = {
          planName: values.planName,
          price: Number(values.price),
          commissionRate: Number(values.commissionRate),
          WalletCreditDelay: Number(values.WalletCreditDelay),
          profileBoost: values.profileBoost,
          durationInMonths: Number(values.durationInMonths),
          description: values.description,
        };

        if (isEditing && initialValues?._id) {
          subscriptionPlanData._id = initialValues._id;
        }

        await onSubmit?.(subscriptionPlanData as SubscriptionPlanFormDto);
      } catch (error) {
        console.error("Error submitting subscription plan form:", error);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="px-2 w-full max-w-3xl mx-auto"
    >
      <div className="mb-6 text-left">
        <InputField
          label="Plan Name"
          name="planName"
          type="text"
          value={formik.values.planName}
          onChange={handlePlanNameChange}
          onBlur={formik.handleBlur}
          placeholder="Enter plan name..."
          error={
            formik.touched.planName && formik.errors.planName
              ? getErrorMessage(formik.errors.planName)
              : undefined
          }
          touched={getTouchedValue(formik.touched.planName)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <InputField
            label="Price (₹)"
            name="price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter the price..."
            error={
              formik.touched.price && formik.errors.price
                ? getErrorMessage(formik.errors.price)
                : undefined
            }
            touched={getTouchedValue(formik.touched.price)}
            style={{ appearance: "textfield" }}
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <InputField
            label="Commission Rate (%)"
            name="commissionRate"
            type="number"
            value={formik.values.commissionRate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter commission rate..."
            error={
              formik.touched.commissionRate && formik.errors.commissionRate
                ? getErrorMessage(formik.errors.commissionRate)
                : undefined
            }
            touched={getTouchedValue(formik.touched.commissionRate)}
            style={{ appearance: "textfield" }}
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <InputField
            label="Wallet Credit Delay (Days)"
            name="WalletCreditDelay"
            type="number"
            value={formik.values.WalletCreditDelay}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter wallet credit delay..."
            error={
              formik.touched.WalletCreditDelay &&
              formik.errors.WalletCreditDelay
                ? getErrorMessage(formik.errors.WalletCreditDelay)
                : undefined
            }
            touched={getTouchedValue(formik.touched.WalletCreditDelay)}
            style={{ appearance: "textfield" }}
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <InputField
            label="Duration (Months)"
            name="durationInMonths"
            type="number"
            value={formik.values.durationInMonths}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter duration in months..."
            error={
              formik.touched.durationInMonths && formik.errors.durationInMonths
                ? getErrorMessage(formik.errors.durationInMonths)
                : undefined
            }
            touched={getTouchedValue(formik.touched.durationInMonths)}
            style={{ appearance: "textfield" }}
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="mb-6 text-left">
        <SelectField
          label="Profile Boost"
          name="profileBoost"
          value={formik.values.profileBoost}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={profileBoostOptions}
          placeholder="Select profile boost option"
          error={
            formik.touched.profileBoost && formik.errors.profileBoost
              ? getErrorMessage(formik.errors.profileBoost)
              : undefined
          }
          touched={getTouchedValue(formik.touched.profileBoost)}
        />
      </div>

      <div className="mb-6 text-left">
        <InputField
          label="Description"
          name="description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter plan description..."
          error={
            formik.touched.description && formik.errors.description
              ? getErrorMessage(formik.errors.description)
              : undefined
          }
          touched={getTouchedValue(formik.touched.description)}
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
          disabled={formik.isSubmitting}
          className="py-2 px-4 w-24"
        >
          {isEditing ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};
