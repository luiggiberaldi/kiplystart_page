/**
 * Supabase client configuration for KiplyStart
 * @module supabaseClient
 * @description
 * Initializes the Supabase client with environment variables.
 * SECURITY: Only uses anon key (never service_role in client).
 * 
 * @example
 * import { supabase } from './lib/supabaseClient';
 * const { data, error } = await supabase.from('products').select('*');
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '❌ Missing Supabase environment variables. Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    );
}

/**
 * Supabase client instance
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
