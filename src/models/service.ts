export interface IService {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  designation:string,
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
