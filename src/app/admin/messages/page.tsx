import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ContactMessage } from "@/types/database";

async function setStatus(formData: FormData) {
  "use server";
  const supabase = createClient();
  await supabase
    .from("contact_messages")
    .update({ status: String(formData.get("status")) })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/messages");
}

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl">
      <h1 className="serif text-3xl mb-8">Messages</h1>
      <div className="flex flex-col gap-4">
        {(messages as ContactMessage[] | null)?.map((m) => (
          <div key={m.id} className="border border-white/10 rounded-xl p-5">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <div className="serif text-lg">{m.name}</div>
                <div className="mono text-[11px] text-stone">{m.email}{m.phone ? ` — ${m.phone}` : ""}</div>
              </div>
              <span className="mono text-[10px] uppercase text-gold">{m.status}</span>
            </div>
            {m.project_type && <div className="text-sm text-stone mb-1">Project: {m.project_type}</div>}
            <p className="text-sm mb-3">{m.message}</p>
            <div className="flex gap-2">
              {["new", "read", "archived"].map((st) => (
                <form key={st} action={setStatus}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="status" value={st} />
                  <button className="mono text-[10px] uppercase text-stone hover:text-paper border border-white/10 rounded-full px-3 py-1.5">
                    Mark {st}
                  </button>
                </form>
              ))}
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && <p className="text-stone">No messages yet.</p>}
      </div>
    </div>
  );
}
