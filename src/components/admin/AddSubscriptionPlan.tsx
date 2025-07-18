import React from "react";
import { useFormik } from "formik";
import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import { ISubscriptionPlan } from "../../models/subscriptionPlan";
import { subscriptionPlanSchema } from "../../utils/validations/formvalidationSchema";

interface AddSubscriptionPlanProps {
  onCancel: () => void;
  onSubmit: (data: ISubscriptionPlan) => Promise<void>;
  isLoading?: boolean;
  initialValues?: Partial<ISubscriptionPlan>;
  isEditing?: boolean;
}

const getErrorMessage = (error: any): string | undefined => {
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error[0];
  return undefined;
};

const getTouchedValue = (touched: any): boolean | undefined => {
  if (typeof touched === "boolean") return touched;
  return !!touched;
};

const planNameOptions = [
  { value: "BASIC", label: "Basic Plan" },
  { value: "PRO", label: "Pro Plan" },
  { value: "ELITE", label: "Elite Plan" },
];

export const AddSubscriptionPlan: React.FC<AddSubscriptionPlanProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  initialValues,
  isEditing = false,
}) => {
  const formik = useFormik({
    initialValues: {
      planName: initialValues?.planName || "",
      monthlyPrice: initialValues?.monthlyPrice || "",
      commissionRate: initialValues?.commissionRate || "",
    },
    validationSchema: subscriptionPlanSchema,
    onSubmit: async (values) => {
      try {
        const subscriptionPlanData: Partial<ISubscriptionPlan> = {
          planName: values.planName as "BASIC" | "PRO" | "ELITE",
          monthlyPrice:
            values.planName === "BASIC" ? 0 : Number(values.monthlyPrice),
          commissionRate: Number(values.commissionRate),
        };

        if (isEditing && initialValues?._id) {
          subscriptionPlanData._id = initialValues._id;
        }

        await onSubmit?.(subscriptionPlanData as ISubscriptionPlan);
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
      {/* Plan Name */}
      <div className="mb-6 text-left">
        <SelectField
          label="Plan Name"
          name="planName"
          value={formik.values.planName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={planNameOptions}
          placeholder="Select plan name"
          error={
            formik.touched.planName && formik.errors.planName
              ? getErrorMessage(formik.errors.planName)
              : undefined
          }
          touched={getTouchedValue(formik.touched.planName)}
        />
      </div>

      {/* Monthly Price and Commission Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <InputField
            label="Monthly Price (₹)"
            name="monthlyPrice"
            type="number"
            value={
              formik.values.planName === "BASIC"
                ? "0"
                : formik.values.monthlyPrice
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter monthly price..."
            disabled={formik.values.planName === "BASIC"}
            error={
              formik.touched.monthlyPrice && formik.errors.monthlyPrice
                ? getErrorMessage(formik.errors.monthlyPrice)
                : undefined
            }
            touched={getTouchedValue(formik.touched.monthlyPrice)}
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

      {/* Form Actions */}
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
