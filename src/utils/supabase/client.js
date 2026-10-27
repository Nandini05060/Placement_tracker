import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://grtzbqbapwbgzmxnxkiq.supabase.co';

const supabaseKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  'sb_publishable_LPbbycC0jZWAcemZeoTMZQ_j35SpuXn';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
