import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Helper to check if we're in demo mode
export const isDemoMode = () => {
  const user = supabase.auth.getUser();
  // Check if user email contains demo or if demo flag is set in local storage
  return localStorage.getItem('demo_mode') === 'true' || 
    (user && user.data?.user?.email?.includes('demo'));
};

// Function to get data with demo mode awareness
export async function getData<T>(
  tableName: string, 
  options: { 
    demoData?: T[], 
    query?: any,
    limit?: number
  } = {}
): Promise<T[]> {
  const { demoData = [], query = supabase.from(tableName).select('*'), limit } = options;
  
  // If in demo mode, return demo data
  if (isDemoMode()) {
    return demoData;
  }
  
  // Otherwise, fetch real data
  let finalQuery = query;
  
  if (limit) {
    finalQuery = finalQuery.limit(limit);
  }
  
  const { data, error } = await finalQuery;
  
  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return [];
  }
  
  return data as T[];
}