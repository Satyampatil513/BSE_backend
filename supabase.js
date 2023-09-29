import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zynfbjjdegyxsysvrgjg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bmZiampkZWd5eHN5c3ZyZ2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU5Njg1OTgsImV4cCI6MjAxMTU0NDU5OH0.ngi7GqT4NBIPneZcROcL0lmUBpoG8EZFjINu9eaXAzU';

export const supabase = createClient(supabaseUrl, supabaseKey);
