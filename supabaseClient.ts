import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gtrkjapupnmgnkqyjnvh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0cmtqYXB1cG5tZ25rcXlqbnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMTI5MzcsImV4cCI6MjA2Nzg4ODkzN30.5825NSUU5pN0Way6xwXfNIVPBgYSlQ-0kqXdssvbaqk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);