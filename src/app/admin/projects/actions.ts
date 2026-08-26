"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveProject(formData: FormData) {
  const supabase = createClient();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");

  const payload = {
    title,
    slug: String(formData.get("slug") || "") || slugify(title),
    category: String(formData.get("category") || "photography"),
    client: String(formData.get("client") || "") || null,
    location: String(formData.get("location") || "") || null,
    cover_image_url: String(formData.get("cover_image_url") || "") || null,
    description: String(formData.get("description") || "") || null,
    credits: String(formData.get("credits") || "") || null,
    is_featured: formData.get("is_featured") === "on",
    status: String(formData.get("status") || "draft"),
  };

  if (id) {
    await supabase.from("projects").update(payload).eq("id", id);
  } else {
    await supabase.from("projects").insert(payload);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/work");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id"));
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/admin/projects");
  revalidatePath("/work");
}
