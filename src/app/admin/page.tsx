import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const [{ count: projectCount }, { count: newMessages }, { count: serviceCount }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("services").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="serif text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 max-w-2xl">
        <Card label="Projects" value={projectCount ?? 0} />
        <Card label="New Messages" value={newMessages ?? 0} />
        <Card label="Services" value={serviceCount ?? 0} />
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 rounded-xl p-6">
      <div className="serif text-4xl text-mossBright">{value}</div>
      <div className="mono text-[10px] text-stone uppercase mt-2">{label}</div>
    </div>
  );
}
