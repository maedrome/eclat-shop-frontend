export interface CartProduct {
  id: string;
  title: string;
  price: number;
  slug: string;
  stock: number;
  sizes: string[];
  images: string[];
}

export interface CartItem {
  id?: string;
  product: CartProduct;
  quantity: number;
  size: string;
}

export interface Cart {
  id?: string;
  items: CartItem[];
}

export interface LocalCartItem {
  productId: string;
  quantity: number;
  size: string;
  product?: CartProduct;
}
