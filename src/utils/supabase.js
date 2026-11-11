import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sjgcutllflktuojqorne.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZ2N1dGxsZmxrdHVvanFvcm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzNzQ2NzUsImV4cCI6MjEwOTk1MDY3NX0.c3yvLmEOMo6_Cpf6yojmpxJnH0NZGZmzhSgRh-NZkq0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
