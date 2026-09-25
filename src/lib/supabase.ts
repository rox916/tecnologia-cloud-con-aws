import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://snndcfhnjvazecvmizpg.supabase.co'; // Tu URL[cite: 4]
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNubmRjZmhuanZhemVjdm1penBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg2MTcsImV4cCI6MjEwNTkyNDYxN30.qNgbkLghoLXUInmYOP8kW0q_wl6MIakwMJOOLms7d9A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);