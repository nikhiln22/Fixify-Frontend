import { toast } from "react-toastify";
import ToastMessage from "../components/common/ToastMessage";
import { ToastMessageProps } from "../types/component.types";

export const showToast = ({ message, type = "info", duration = 3000 }: ToastMessageProps) => {
  toast(<ToastMessage message={message} type={type} />, {
    type,
    autoClose: duration,
    hideProgressBar: true,
    pauseOnHover: true,
    draggable: true,
    position: "top-right",
  });
};
