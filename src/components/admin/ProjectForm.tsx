"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/database";
import { saveProject } from "@/app/admin/projects/actions";

const CATEGORIES = ["photography", "video", "product", "commercial", "social", "events", "branding"];

export default function ProjectForm({ project }: { project?: Project }) {
  const [imageUrl, setImageUrl] = useState(project?.cover_image_url ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = ${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt};

    const { error } = await supabase.storage.from("project-images").upload(fileName, file);

    if (error) {
      alert("فشل رفع الصورة: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(fileName);
    setImageUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <form action={saveProject} className="max-w-2xl flex flex-col gap-5">
      {project && <input type="hidden" name="id" value={project.id} />}

      <Field label="Title">
        <input name="title" defaultValue={project?.title} required className="input" />
      </Field>
      <Field label="Slug (leave blank to auto-generate)">
        <input name="slug" defaultValue={project?.slug} className="input" />
      </Field>
      <Field label="Category">
        <select name="category" defaultValue={project?.category || "photography"} className="input">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Client"><input name="client" defaultValue={project?.client ?? ""} className="input" /></Field>
      <Field label="Location"><input name="location" defaultValue={project?.location ?? ""} className="input" /></Field>

      <Field label="Cover Image">
        <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
        {uploading && <p className="text-stone text-xs mt-2">جاري الرفع...</p>}
        {imageUrl && !uploading && (
          <img src={imageUrl} alt="Preview" className="mt-3 rounded-sm max-h-48 object-cover" />
        )}
        <input type="hidden" name="cover_image_url" value={imageUrl} />
      </Field>

      <Field label="Description">
        <textarea name="description" defaultValue={project?.description ?? ""} rows={4} className="input" />
      </Field>
      <Field label="Credits"><input name="credits" defaultValue={project?.credits ?? ""} className="input" /></Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_featured" defaultChecked={project?.is_featured} />
        Feature on homepage
      </label>

      <Field label="Status">
        <select name="status" defaultValue={project?.status || "draft"} className="input">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </Field>

      <button type="submit" disabled={uploading} className="mono text-xs uppercase bg-paper text-ink rounded-full px-6 py-3.5 w-fit disabled:opacity-50">
        Save Project
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mono text-[10px] text-stone block mb-2 uppercase">{label}</label>
      {children}
    </div>
  );
}