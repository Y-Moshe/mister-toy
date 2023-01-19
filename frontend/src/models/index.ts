export interface IUser {
  _id?: string;
  fullname: string;
  username: string;
  password?: string;
  isAdmin: boolean;
}

export interface IToy {
  _id?: string;
  name: string;
  price: number;
  inStock: boolean;
  tags: string[];
  imgUrl: string;
  reviews: any[];
}