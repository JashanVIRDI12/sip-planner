import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://clukkdggflblzaypvzrb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdWtrZGdnZmxibHpheXB2enJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTU2NzIsImV4cCI6MjA2MDYzMTY3Mn0.8ZtagyI6y25JzAFClaKUrTGDOzNPkDUjm2ar1v7zR-k'

export const supabase = createClient(supabaseUrl, supabaseKey)

