import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, GrindOption, WeightOption } from '../types';

interface AddToCartOptions {
  grind?: GrindOption;
  weight?: WeightOption;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, options?: AddToCartOptions) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  couponCode: string;
  discountPercent: number;
  discountFlat: number;
  couponError: string | null;
  couponSuccess: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  totalItemsCount: number;
  notification: string | null;
  clearNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const COUPONS: Record<string, { percent?: number; flat?: number; desc: string }> = {
  'KAAPI1938': { percent: 15, desc: '15% Heritage Discount' },
  'CHIKMAGALUR10': { percent: 10, desc: '10% Welcome Kaapi Discount' },
  'FIRSTBREW': { flat: 75, desc: '₹75 Off First Order' },
};

function calculatePriceForWeight(basePrice: number, weight: WeightOption): number {
  if (weight === '250g') {
    return Math.round(basePrice * 0.58);
  }
  if (weight === '1kg') {
    return Math.round(basePrice * 1.88); // bulk savings
  }
  return basePrice; // 500g default
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('chikmagalur_cart_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }
    // Default starter item for aesthetic realism
    return [
      {
        id: '1-Traditional South Indian Filter Grind-500g',
        product: {
          id: 1,
          name: "Grand Aroma Coffee Powder (80:20)",
          price: "₹ 150.00",
          rawPrice: 150,
          category: "powder",
          image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          description: "Premium blend of 80% Coffee and 20% Chicory for authentic South Indian filter decoction.",
          roastProfile: "Medium-Dark Roast",
          weight: "500g"
        },
        quantity: 2,
        grind: 'Traditional South Indian Filter Grind',
        weight: '500g',
        unitPrice: 150
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>('CHIKMAGALUR10');
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [discountFlat, setDiscountFlat] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>('10% Welcome Kaapi Discount applied');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('chikmagalur_cart_items', JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);
  const clearNotification = () => setNotification(null);

  const addToCart = (product: Product, options?: AddToCartOptions) => {
    const grind: GrindOption = options?.grind || (product.category === 'beans' ? 'Whole Roasted Beans' : 'Traditional South Indian Filter Grind');
    const weight: WeightOption = options?.weight || (product.weight === '250g' ? '250g' : '500g');
    const quantity = options?.quantity || 1;
    
    const unitPrice = calculatePriceForWeight(product.rawPrice, weight);
    const cartItemId = `${product.id}-${grind}-${weight}`;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: cartItemId,
            product,
            quantity,
            grind,
            weight,
            unitPrice
          }
        ];
      }
    });

    setNotification(`Added "${product.name}" (${weight}) to your cart`);
    setTimeout(() => setNotification(null), 3000);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    setCouponError(null);
    setCouponSuccess(null);

    if (!cleanCode) {
      setCouponError('Please enter a valid coupon code.');
      return false;
    }

    const matched = COUPONS[cleanCode];
    if (matched) {
      setCouponCode(cleanCode);
      setDiscountPercent(matched.percent || 0);
      setDiscountFlat(matched.flat || 0);
      setCouponSuccess(`Coupon "${cleanCode}" applied: ${matched.desc}`);
      return true;
    } else {
      setCouponError('Invalid coupon code. Try KAAPI1938 or CHIKMAGALUR10');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setDiscountFlat(0);
    setCouponError(null);
    setCouponSuccess(null);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  let discountAmount = 0;
  if (discountPercent > 0) {
    discountAmount = Math.round((subtotal * discountPercent) / 100);
  } else if (discountFlat > 0) {
    discountAmount = Math.min(discountFlat, subtotal);
  }

  // Shipping is free if discounted subtotal is >= ₹499
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const shippingAmount = subtotal === 0 ? 0 : taxableAmount >= 499 ? 0 : 50;
  const totalAmount = subtotal === 0 ? 0 : taxableAmount + shippingAmount;
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        discountPercent,
        discountFlat,
        couponError,
        couponSuccess,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingAmount,
        totalAmount,
        totalItemsCount,
        notification,
        clearNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
