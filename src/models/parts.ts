export interface IPart {
  _id: string;
  name: string;
  description: string;
  price: number;
  services: {
    _id: string;
    name: string;
  }[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
