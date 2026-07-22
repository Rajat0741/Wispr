import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabasePublishableKey =process.env.NEXT_PUBLIC_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_PUBLISHABLE_KEY) are missing."
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  supabasePublishableKey || ""
);
