"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SiteHeader({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[900] flex items-center justify-between px-10 py-5 transition-all duration-300 ${
        scrolled ? "bg-ink/85 backdrop-blur-md border-b border-white/10 py-3.5" : ""
      }`}
    >
      <Link href="/" className="serif text-lg">
        {siteName.split(" ")[0]?.toUpperCase()}{" "}
        <em className="italic text-mossBright not-italic">
          {siteName.split(" ").slice(1).join(" ").toUpperCase()}
        </em>
      </Link>
      <nav className="hidden md:flex gap-9">
        <Link href="/work" className="mono text-xs text-stone hover:text-paper">Work</Link>
        <Link href="/services" className="mono text-xs text-stone hover:text-paper">Services</Link>
        <Link href="/about" className="mono text-xs text-stone hover:text-paper">About</Link>
        <Link href="/contact" className="mono text-xs text-stone hover:text-paper">Contact</Link>
      </nav>
      <Link
        href="/contact"
        className="hidden md:inline-block border border-white/15 rounded-full px-5 py-2 text-xs mono hover:border-gold hover:text-gold"
      >
        Let&apos;s Talk
      </Link>
    </header>
  );
}
