import { Itechnician } from "../models/technician";
import { ITimeSlot } from "../models/timeslot";

export interface SubmitTechnicianQualificationResponse {
  message: string;
  success: boolean;
  status: number;
  technician: Pick<
    Itechnician,
    "yearsOfExperience" | "Designation" | "About" | "image" | "certificates"
  >;
}

export interface TechnicianProfileResponse {
  message: string;
  success: boolean;
  status: number;
  data?: Itechnician;
}

export interface ITimeSlotData {
  dateTimeSlots: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface CreateTimeSlotsResponse {
  success: boolean;
  message: string;
  data?: ITimeSlot[];
}

export interface GetTimeSlotResponse {
  success: boolean;
  message: string;
  status: number;
  data?: ITimeSlot[];
}

export interface StartServicePayload {
  serviceStartTime?: string;
}

export interface VerifyOtpPayload {
  otp: string;
  serviceEndTime?: string;
}
