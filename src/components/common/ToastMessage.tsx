import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { ToastMessageProps } from "../../types/component.types";

const iconMap = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  info: <Info className="text-blue-500" />,
};

const ToastMessage = ({ message, type = "info" }: ToastMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-lg border border-gray-200 w-full max-w-sm"
    >
      <div>{iconMap[type]}</div>
      <span className="text-sm text-gray-800 font-medium">{message}</span>
    </motion.div>
  );
};

export default ToastMessage;