
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerSurname: string;
  state: string;
  city: string;
  productId: string;
  productName: string;
  price: number;
  timestamp: string;
}

export interface AuthState {
  isAdmin: boolean;
}
