import { Iuser } from "../models/user";

export interface UserProfileResponse {
  message: string;
  success: boolean;
  status: number;
  user?: Iuser;
}
