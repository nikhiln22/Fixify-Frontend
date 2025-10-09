export interface IService {
  _id: string;
  name: string;
  price?: number;
  image: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  designation: {
    _id: string;
    designation: string;
  };
  status: string;
  serviceType: "fixed" | "hourly";
  estimatedTime?: number;
  hourlyRate?: number;
  maxHours?: number;
  createdAt?: string;
  updatedAt?: string;
}
