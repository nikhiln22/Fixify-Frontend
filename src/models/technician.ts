export interface Itechnician {
  username: string;
  email: string;
  password: string;
  phone: number;
  status?: string;
  is_verified: boolean;
  yearsOfExperience?: number;
  jobDesignation?: string;
  About?: string;
  image?: string;
  role:string
  createdAt: Date;
  updatedAt: Date;
}
