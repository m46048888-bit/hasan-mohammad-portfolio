"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "./actions";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  return (
    <form
      className="flex flex-col"
      action={(formData) => {
        startTransition(async () => {
          const res = await submitContactMessage(formData);
          setResult(res);
        });
      }}
    >
      <Field label="Name"><input name="name" required placeholder="Your full name" className="w-full bg-transparent outline-none text-base" /></Field>
      <Field label="Email"><input name="email" type="email" required placeholder="you@email.com" className="w-full bg-transparent outline-none text-base" /></Field>
      <Field label="Project Type"><input name="project_type" placeholder="Photography / Video / Both" className="w-full bg-transparent outline-none text-base" /></Field>
      <Field label="Budget"><input name="budget" placeholder="Optional" className="w-full bg-transparent outline-none text-base" /></Field>
      <Field label="Message"><textarea name="message" required rows={3} placeholder="Tell me about the project…" className="w-full bg-transparent outline-none text-base resize-none" /></Field>

      <div className="flex justify-between items-center mt-6">
        <span className="mono text-[11px] text-stone">
          {result?.ok ? "Message sent — thank you." : result?.error || "Reply within 24h"}
        </span>
        <button type="submit" disabled={isPending} className="mono text-xs uppercase bg-ink text-paper rounded-full px-6 py-3.5 hover:bg-moss transition-colors disabled:opacity-50">
          {isPending ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-black/15 py-4">
      <label className="mono text-[10px] text-stone block mb-2">{label}</label>
      {children}
    </div>
  );
}
