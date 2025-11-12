import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://lllzgxtemjjppbzdfxoi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbHpneHRlbWpqcHBiemRmeG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjE5MDYsImV4cCI6MjA3ODUzNzkwNn0.RvfOTAQTu0ppKOKQ48vSxThCrzwHE7I4sBHPSISmoSY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;