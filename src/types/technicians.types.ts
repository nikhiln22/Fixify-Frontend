import { Itechnician } from "../models/technician";

export interface JobDesignationResponse {
  message: string;
  success: boolean;
  designation: string[];
  status: number;
}

export interface SubmitTechnicianQualificationResponse {
  message: string;
  success: boolean;
  status: number;
  technician: Pick<
    Itechnician,
    | "yearsOfExperience"
    | "Designation"
    | "About"
    | "image"
    | "certificates"
    | "address"
  >;
}

export interface TechnicianProfileResponse {
  message: string;
  success: boolean;
  status: number;
  technician?: Itechnician;
}
