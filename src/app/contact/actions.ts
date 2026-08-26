"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(formData: FormData) {
  const supabase = createClient();

  const payload = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || null,
    company: String(formData.get("company") || "") || null,
    project_type: String(formData.get("project_type") || "") || null,
    budget: String(formData.get("budget") || "") || null,
    message: String(formData.get("message") || ""),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return { ok: false, error: "Please fill in your name, email and message." };
  }

  const { error } = await supabase.from("contact_messages").insert(payload);

  if (error) {
    return { ok: false, error: "Something went wrong sending your message. Please try again." };
  }

  return { ok: true };
}
