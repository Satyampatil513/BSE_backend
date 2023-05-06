import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogqlyaeajgbfymkdcwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ3FseWFlYWpnYmZ5bWtkY3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyODU2NTIsImV4cCI6MTk5ODg2MTY1Mn0.0Tv9LdzXboO7WryR5iDF7cxNAntI0TXCiFX_sJPV9Ng';

export const supabase = createClient(supabaseUrl, supabaseKey);
