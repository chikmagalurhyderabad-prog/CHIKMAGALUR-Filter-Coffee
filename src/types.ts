export interface Product {
  id: number;
  name: string;
  price: string;
  rawPrice: number;
  category: 'all' | 'powder' | 'beans' | 'estate';
  image: string;
  description: string;
  roastProfile?: string;
  weight?: string;
}

export type GrindOption = 
  | 'Traditional South Indian Filter Grind'
  | 'Medium Grind (Moka Pot & Pour Over)'
  | 'Coarse Grind (French Press / Cold Brew)'
  | 'Whole Roasted Beans';

export type WeightOption = '250g' | '500g' | '1kg';

export interface CartItem {
  id: string; // unique item key e.g. `${productId}-${grind}-${weight}`
  product: Product;
  quantity: number;
  grind: GrindOption;
  weight: WeightOption;
  unitPrice: number;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  label: 'Home' | 'Office' | 'Other';
}

export interface UserPreferences {
  roastPreference: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  chicoryPreference: '100% Pure Kaapi' | '80:20 Blend' | '70:30 Traditional' | 'Custom';
  brewingMethod: 'Traditional South Indian Brass Drip' | 'Moka Pot' | 'French Press' | 'Pour Over / V60' | 'AeroPress';
  milkType: 'Whole Milk' | 'Oat Milk' | 'Black / No Milk' | 'Soy / Almond';
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  memberSince?: string;
  addresses: ShippingAddress[];
  preferences: UserPreferences;
}

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  grind: GrindOption;
  weight: WeightOption;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Freshly Roasted & Packed' | 'Dispatched from Chikmagalur' | 'In Transit' | 'Delivered';
  shippingAddress: ShippingAddress;
  paymentMethod: 'UPI' | 'Credit / Debit Card' | 'Netbanking' | 'Cash on Delivery';
  notes?: string;
}
