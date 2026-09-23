import "server-only";

import { createClient } from "@supabase/supabase-js";

// Usa la secret key y salta RLS: solo para Route Handlers y código de servidor.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
