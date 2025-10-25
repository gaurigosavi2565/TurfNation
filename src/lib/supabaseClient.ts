import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Sport = {
  id: string;
  name: string;
};

export type Turf = {
  id: string;
  name: string;
  city: string;
  area: string;
  state: string;
  lat?: number;
  lng?: number;
  amenities: string[];
  images: string[];
  rating: number;
  price_per_hour: number;
  sports: string[];
  is_active: boolean;
};

export type TurfAvailability = {
  id: string;
  turf_id: string;
  sport_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
};

export type Booking = {
  id: string;
  turf_id: string;
  sport_id: string;
  user_id?: string;
  start_at: string;
  end_at: string;
  hours: number;
  amount_inr: number;
  status: string;
};

export type Profile = {
  id: string;
  email: string;
  role: 'player' | 'owner';
  display_name: string;
};