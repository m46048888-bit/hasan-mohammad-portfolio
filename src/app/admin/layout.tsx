import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login page itself renders without this layout wrapper's guard needs,
  // but Next.js still runs this layout for /admin/login — so skip the
  // redirect loop by allowing unauthenticated access to just render children
  // there; middleware.ts already handles the actual gate for every other route.
  if (!user) {
    return <>{children}</>;
  }

  // Middleware only confirms "logged in" — this confirms "allowed in admin_users".
  // Someone who signs up for a normal Supabase account but isn't in admin_users
  // gets bounced here, even though they have a valid session.
  const { data: adminRow } = await supabase.from("admin_users").select("id").eq("id", user.id).single();

  if (!adminRow) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink text-paper flex">
      <aside className="w-60 border-r border-white/10 px-6 py-8 flex flex-col justify-between">
        <div>
          <div className="serif text-lg mb-10">Owner Panel</div>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mono text-xs uppercase text-stone hover:text-paper px-3 py-2.5 rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <LogoutButton />
      </aside>
      <main className="flex-1 px-10 py-10 overflow-y-auto">{children}</main>
    </div>
  );
}
