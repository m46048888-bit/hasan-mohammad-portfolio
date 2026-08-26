import { createBrowserClient } from "@supabase/ssr";

/**
 * Use this client in Client Components ("use client").
 * It reads/writes the auth session via browser cookies.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
