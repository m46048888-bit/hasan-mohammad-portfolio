import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/database";
import { deleteProject } from "./actions";

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase.from("projects").select("*").order("sort_order");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="serif text-3xl">Projects</h1>
        <Link href="/admin/projects/new" className="mono text-xs uppercase bg-paper text-ink rounded-full px-5 py-3">
          + New Project
        </Link>
      </div>

      <div className="border-t border-white/10">
        {(projects as Project[] | null)?.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 py-4 border-b border-white/10">
            <div>
              <div className="serif text-lg">{p.title}</div>
              <div className="mono text-[10px] text-stone uppercase">
                {p.category} — {p.status}
                {p.is_featured ? " — featured" : ""}
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/projects/${p.id}`} className="mono text-xs text-stone hover:text-paper">
                Edit
              </Link>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={p.id} />
                <button className="mono text-xs text-red-400 hover:text-red-300">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {(!projects || projects.length === 0) && <p className="text-stone py-6">No projects yet.</p>}
      </div>
    </div>
  );
}
