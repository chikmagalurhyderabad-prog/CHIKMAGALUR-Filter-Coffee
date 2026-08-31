import { createClient } from '@supabase/supabase-js';

// These will be replaced with actual env variables later
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  created_at?: string;
};

export type Profile = {
  id: string;
  role: 'admin' | 'user';
  name: string;
  created_at?: string;
};
