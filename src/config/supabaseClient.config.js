import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_API_URL
const supabaseKey = import.meta.env.VITE_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
    logger: {
      log: () => null,
      warn: () => null,
      error: import.meta.env.PROD ? () => null : console.error, // Only log errors in dev
    },
  });

export default supabase;
