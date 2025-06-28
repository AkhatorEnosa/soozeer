import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zkyloatzdjcjvjoehrdu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreWxvYXR6ZGpjanZqb2VocmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxMjgzMTMsImV4cCI6MjA0MTcwNDMxM30.FHcCqWmSv01FP-G6kc0uVWDJIJLIJke-MOsAlxv4tIA"

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;