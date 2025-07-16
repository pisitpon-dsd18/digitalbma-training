import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htvancggcenyilcoedic.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmFuY2dnY2VueWlsY29lZGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTIwMzUsImV4cCI6MjA2ODIyODAzNX0.7WvJH_sF5gu-62Kht5mNJhA_nNOMHOMhMWg3O1oMIDI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);