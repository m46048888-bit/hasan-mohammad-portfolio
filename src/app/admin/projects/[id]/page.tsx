import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/types/database";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single();

  if (!project) notFound();

  return (
    <div>
      <h1 className="serif text-3xl mb-8">Edit Project</h1>
      <ProjectForm project={project as Project} />
    </div>
  );
}
