export interface Iuser {
  _id: string;
  username: string;
  email: string;
  phone: number;
  status: boolean;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  access_token: string;
}
