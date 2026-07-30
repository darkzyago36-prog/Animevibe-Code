import { createClient } from '@supabase/supabase-js';

// Corrige possível erro de digitação no .env onde a URL termina com .com em vez de .co
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.com', '.supabase.co') || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
