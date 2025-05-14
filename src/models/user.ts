export interface Iuser {
  _id: string;
  username: string;
  email: string;
  phone: number;
  status: string;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  access_token: string;
}
