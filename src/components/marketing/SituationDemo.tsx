"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { chatHref } from "@/lib/chat/openChat";

const PLACEHOLDERS = [
  "I'm an SC student in Tamil Nadu looking for a scholarship…",
  "I'm a girl student in engineering — are there scholarships for me?…",
  "I need an education loan for my postgraduate studies…",
  "I'm a PhD student looking for a UGC fellowship…",
];

const CHIPS: { label: string; seed: string }[] = [
  { label: "I need a scholarship", seed: "I'm a student looking for a scholarship to pay my college fees." },
  { label: "SC / ST student", seed: "I'm an SC/ST student — what scholarships and fellowships am I eligible for?" },
  { label: "Education loan", seed: "I need an education loan to pay my course fees." },
  { label: "PhD fellowship", seed: "I'm a PhD student looking for a fellowship or research grant." },
];

/** Preview input that rotates placeholders and routes to the /chat page. */
export function SituationDemo() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  function submit() {
    router.push(chatHref(value.trim() || undefined));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-col gap-3 rounded-2xl border border-navy/15 bg-surface-card p-3 shadow-card sm:flex-row sm:items-center"
      >
        <label htmlFor="situation" className="sr-only">
          Describe your situation
        </label>
        <div className="flex flex-1 items-center gap-2 px-2">
          <Search className="h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
          <input
            id="situation"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={PLACEHOLDERS[index]}
            className="w-full bg-transparent py-2.5 text-base text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
        <button type="submit" className={buttonClasses({ variant: "primary", size: "md" })}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Find schemes
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => router.push(chatHref(chip.seed))}
            className="rounded-full border border-navy/20 bg-surface-card px-3.5 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-surface-subtle"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-ink-faint">
        This is a preview. Real-time scheme matching is coming soon.
      </p>
    </div>
  );
}
