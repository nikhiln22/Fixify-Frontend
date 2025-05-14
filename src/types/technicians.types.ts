
import { Itechnician } from "../models/technician";

export interface Location {
  locationName: string;
  pincode: string;
  cityName: string;
}

export interface JobDesignationResponse {
  message: string;
  success: boolean;
  designation: string[];
  status: number;
}

export interface CityLocationResponse {
  cities?: string[];
  message: string;
  success: boolean;
  status: number;
}

export interface LocationsByCityResponse {
  success: boolean;
  message?: string;
  status: number;
  locations?: Location[];
}


export interface TechnicianQualificationData {
  experience: string;
  designation: string;
  about: string;
  city: string;
  preferredWorkLocation: string;
  profilePhoto: File | null;
  certificates: File[]; 
}

export interface SubmitTechnicianQualificationResponse {
  message: string;
  success: boolean;
  status: number;
  technician: Pick<
    Itechnician,
    "yearsOfExperience" | "Designation" | "About" | "image" | "certificates" | "city" | "preferredWorkLocation"
  >;
}

export interface TechnicianProfileResponse {
  message: string;
  success: boolean;
  status: number;
  technician?: Itechnician;
}