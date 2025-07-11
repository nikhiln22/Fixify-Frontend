export interface Itechnician {
  _id: string;
  username: string;
  email: string;
  phone: number;
  status?: string;
  is_verified: boolean;
  yearsOfExperience?: number;
  Designation?: string;
  About?: string;
  image?: string;
  certificates?: string[];
  address?: string;
  longitude?: number;
  latitude?: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  access_token: string;
}
