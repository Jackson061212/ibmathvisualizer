import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://uyxqxuddnxvkdzqfqdoe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eHF4dWRkbnh2a2R6cWZxZG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM4OTY3NjksImV4cCI6MjAzOTQ3Mjc2OX0.5oa24ykX7tTKgwg9SJ6F0v94pfj2xFHng2bJHhSh_qc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);