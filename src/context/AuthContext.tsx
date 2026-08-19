import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ShippingAddress, UserPreferences, Order } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInAnonymously, signOut as fbSignOut } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const DEFAULT_ADDRESSES: ShippingAddress[] = [];

const DEFAULT_PREFERENCES: UserPreferences = {
  roastPreference: 'Medium-Dark',
  chicoryPreference: '80:20 Blend',
  brewingMethod: 'Traditional South Indian Brass Drip',
  milkType: 'Whole Milk'
};

const DEFAULT_ORDERS: Order[] = [];

interface AuthContextType {
  user: UserProfile | null;
  orders: Order[];
  isAuthenticated: boolean;
  isLoading: boolean;
  updateProfile: (updated: Partial<UserProfile>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addAddress: (address: Omit<ShippingAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<ShippingAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Promise<Order>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('chikmagalur_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Rishanth Reddy') {
          localStorage.removeItem('chikmagalur_user_profile');
        } else {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return {
      uid: 'usr-kaapi-connoisseur-1',
      name: '',
      email: '',
      phone: '',
      memberSince: 'Just now',
      addresses: DEFAULT_ADDRESSES,
      preferences: DEFAULT_PREFERENCES
    };
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('chikmagalur_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved orders', e);
      }
    }
    return DEFAULT_ORDERS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('chikmagalur_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('chikmagalur_user_profile');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('chikmagalur_orders', JSON.stringify(orders));
  }, [orders]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updated } : null);
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...prefs
        }
      };
    });
  };

  const addAddress = (newAddr: Omit<ShippingAddress, 'id'>) => {
    const addrId = `addr-${Date.now()}`;
    const formatted: ShippingAddress = {
      ...newAddr,
      id: addrId,
      isDefault: newAddr.isDefault || (user?.addresses.length === 0)
    };

    setUser(prev => {
      if (!prev) return null;
      const updatedAddresses = formatted.isDefault
        ? prev.addresses.map(a => ({ ...a, isDefault: false })).concat(formatted)
        : [...prev.addresses, formatted];
      return {
        ...prev,
        addresses: updatedAddresses
      };
    });
  };

  const updateAddress = (id: string, patch: Partial<ShippingAddress>) => {
    setUser(prev => {
      if (!prev) return null;
      let updatedAddresses = prev.addresses.map(a => a.id === id ? { ...a, ...patch } : a);
      if (patch.isDefault) {
        updatedAddresses = updatedAddresses.map(a => a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false });
      }
      return {
        ...prev,
        addresses: updatedAddresses
      };
    });
  };

  const deleteAddress = (id: string) => {
    setUser(prev => {
      if (!prev) return null;
      const filtered = prev.addresses.filter(a => a.id !== id);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return {
        ...prev,
        addresses: filtered
      };
    });
  };

  const setDefaultAddress = (id: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map(a => ({
          ...a,
          isDefault: a.id === id
        }))
      };
    });
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Promise<Order> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CKM-1938-${randomNum}`;
    const dateFormatted = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateFormatted,
    };

    setOrders(prev => [newOrder, ...prev]);

    return newOrder;
  };

  const loginAsGuest = () => {
    setUser({
      uid: `guest-${Date.now()}`,
      name: 'Kaapi Enthusiast',
      email: 'customer@chikmagalurcoffee.com',
      memberSince: 'Just now',
      addresses: DEFAULT_ADDRESSES,
      preferences: DEFAULT_PREFERENCES
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        isAuthenticated: !!user,
        isLoading,
        updateProfile,
        updatePreferences,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        createOrder,
        loginAsGuest,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
