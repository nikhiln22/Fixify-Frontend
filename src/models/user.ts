export interface Iuser {
  username: string;
  email: string;
  phone: number;
  status: string;
  image?: string;
  role:string
  createdAt: Date;
  updatedAt: Date;
}
