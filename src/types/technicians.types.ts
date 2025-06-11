import { Itechnician } from "../models/technician";
import { ITimeSlot } from "../models/timeslot";

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

export interface TimeSlotData {
  startTime: string;
  endTime: string;
}

export interface CreateTimeSlotsResponse {
  success: boolean;
  message: string;
  data?: any; 
}

export interface GetTimeSlotResponse{
  success:boolean;
  message:string;
  status:number;
  data?:ITimeSlot[];
}