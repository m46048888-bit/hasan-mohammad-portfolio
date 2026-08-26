import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Service } from "@/types/database";

async function addService(formData: FormData) {
  "use server";
  const supabase = createClient();
  await supabase.from("services").insert({
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    sort_order: Number(formData.get("sort_order") || 0),
  });
  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/services");
}

async function updateService(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = String(formData.get("id"));
  await supabase
    .from("services")
    .update({
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      sort_order: Number(formData.get("sort_order") || 0),
      is_visible: formData.get("is_visible") === "on",
    })
    .eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/services");
}

async function deleteService(formData: FormData) {
  "use server";
  const supabase = createClient();
  await supabase.from("services").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/services");
}

export default async function AdminServicesPage() {
  const supabase = createClient();
  const { data: services } = await supabase.from("services").select("*").order("sort_order");

  return (
    <div className="max-w-2xl">
      <h1 className="serif text-3xl mb-8">Services</h1>

      <div className="flex flex-col gap-6 mb-12">
        {(services as Service[] | null)?.map((s) => (
          <form key={s.id} action={updateService} className="border border-white/10 rounded-xl p-5 flex flex-col gap-3">
            <input type="hidden" name="id" value={s.id} />
            <input name="title" defaultValue={s.title} className="input" />
            <textarea name="description" defaultValue={s.description} rows={2} className="input" />
            <div className="flex items-center gap-4">
              <input name="sort_order" type="number" defaultValue={s.sort_order} className="input w-24" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_visible" defaultChecked={s.is_visible} /> Visible
              </label>
              <button type="submit" className="mono text-xs uppercase bg-paper text-ink rounded-full px-4 py-2 ml-auto">
                Save
              </button>
            </div>
            <button
              formAction={deleteService}
              className="mono text-[11px] text-red-400 hover:text-red-300 self-start"
            >
              Delete service
            </button>
          </form>
        ))}
      </div>

      <h2 className="serif text-xl mb-4">Add a service</h2>
      <form action={addService} className="border border-white/10 rounded-xl p-5 flex flex-col gap-3">
        <input name="title" placeholder="Service title" required className="input" />
        <textarea name="description" placeholder="Description" required rows={2} className="input" />
        <input name="sort_order" type="number" placeholder="Sort order" defaultValue={0} className="input w-24" />
        <button type="submit" className="mono text-xs uppercase bg-paper text-ink rounded-full px-5 py-3 w-fit">
          + Add Service
        </button>
      </form>
    </div>
  );
}
