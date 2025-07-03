import Button from "./Button";

interface BookingHeaderProps {
  onBackClick: () => void;
  userType?: "user" | "technician" | "admin";
}

export const BookingHeader: React.FC<BookingHeaderProps> = ({ 
  onBackClick, 
  userType = "user" 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className={`mb-2 ${
          userType === "admin" 
            ? "text-3xl font-semibold text-gray-900" 
            : "text-3xl font-bold text-gray-900"
        }`}>
          Booking Details
        </h1>
      </div>
      <Button
        onClick={onBackClick}
        variant="outline"
      >
        Back to Bookings
      </Button>
    </div>
  );
};