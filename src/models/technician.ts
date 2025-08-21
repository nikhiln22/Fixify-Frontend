export interface Itechnician {
  _id: string;
  username: string;
  email: string;
  phone: number;
  status?: string;
  is_verified: boolean;
  email_verified: boolean;
  yearsOfExperience?: number;
  Designation?: {
    _id: string;
    designation: string;
  };
  About?: string;
  image?: string;
  certificates?: string[];
  address?: string;
  longitude?: number;
  latitude?: number;
  createdAt: Date;
  updatedAt: Date;
}
