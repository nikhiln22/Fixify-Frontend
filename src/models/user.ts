export interface Iuser {
  _id: string;
  username: string;
  email: string;
  phone: number;
  status: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
