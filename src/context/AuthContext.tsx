import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ShippingAddress, UserPreferences, Order } from '../types';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('chikmagalur_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('chikmagalur_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: User) => {
    setIsLoading(true);
    try {
      // In a real app, we fetch from 'profiles' table.
      // For now, if the table isn't set up yet, we'll mock the response based on the user's email.
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      // If error occurs (e.g. table doesn't exist yet because we deferred setup), use fallback mock
      const userRole = (error || !profile) && supabaseUser.email === 'admin@chikmagalur.com' ? 'admin' : (profile?.role || 'user');
      const userName = profile?.name || supabaseUser.email?.split('@')[0] || 'Coffee Lover';

      // Load mock local addresses & preferences for now
      const savedLocalStr = localStorage.getItem(`chk_mock_data_${supabaseUser.id}`);
      const savedLocal = savedLocalStr ? JSON.parse(savedLocalStr) : { addresses: DEFAULT_ADDRESSES, preferences: DEFAULT_PREFERENCES };

      setUser({
        uid: supabaseUser.id,
        name: userName,
        email: supabaseUser.email || '',
        memberSince: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Just now',
        role: userRole,
        addresses: savedLocal.addresses,
        preferences: savedLocal.preferences
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Keep local mock data in sync if we update it
  useEffect(() => {
    if (user) {
      localStorage.setItem(`chk_mock_data_${user.uid}`, JSON.stringify({
        addresses: user.addresses,
        preferences: user.preferences
      }));
    }
  }, [user]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updated } : null);
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, preferences: { ...prev.preferences, ...prefs } };
    });
  };

  const addAddress = (newAddr: Omit<ShippingAddress, 'id'>) => {
    const addrId = `addr-${Date.now()}`;
    setUser(prev => {
      if (!prev) return null;
      const formatted: ShippingAddress = {
        ...newAddr,
        id: addrId,
        isDefault: newAddr.isDefault || (prev.addresses.length === 0)
      };
      const updatedAddresses = formatted.isDefault
        ? prev.addresses.map(a => ({ ...a, isDefault: false })).concat(formatted)
        : [...prev.addresses, formatted];
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const updateAddress = (id: string, patch: Partial<ShippingAddress>) => {
    setUser(prev => {
      if (!prev) return null;
      let updatedAddresses = prev.addresses.map(a => a.id === id ? { ...a, ...patch } : a);
      if (patch.isDefault) {
        updatedAddresses = updatedAddresses.map(a => a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false });
      }
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const deleteAddress = (id: string) => {
    setUser(prev => {
      if (!prev) return null;
      const filtered = prev.addresses.filter(a => a.id !== id);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return { ...prev, addresses: filtered };
    });
  };

  const setDefaultAddress = (id: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map(a => ({ ...a, isDefault: a.id === id }))
      };
    });
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Promise<Order> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `CKM-1938-${randomNum}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        // Validate status against Postgres check constraint
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];
        const dbStatus = validStatuses.includes(newOrder.status) ? newOrder.status : 'pending';

        // Insert into Supabase 'orders' table
        const { error } = await supabase.from('orders').insert([{
          user_id: session.session.user.id,
          items: newOrder.items,
          total_amount: newOrder.total,
          shipping_address: newOrder.shippingAddress,
          status: dbStatus
        }]);
        if (error) {
          console.error('Error saving order to Supabase:', error);
        }
      }
    } catch (err) {
      console.error('Failed to create order in database:', err);
    }

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
