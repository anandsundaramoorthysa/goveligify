"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Keyboard,
  Plus,
  Search,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

interface Props {
  hasMessages: boolean;
  onReset: () => void;
  onDownload: () => void;
  fontStepIndex: number;
  maxFontStepIndex: number;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  messages: Message[];
  onJumpToMessage: (id: string) => void;
}

const iconButton =
  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-subtle hover:text-navy disabled:opacity-30 disabled:hover:bg-transparent";

const SHORTCUTS: { keys: string; label: string }[] = [
  { keys: "/", label: "Focus the message box" },
  { keys: "Enter", label: "Send your message" },
  { keys: "Shift + Enter", label: "Add a new line" },
  { keys: "Esc", label: "Stop the current response" },
];

/**
 * Slim sticky header for the full-screen assistant: bot avatar + title with
 * an "online" dot, and a Botinigo-style action toolbar — text size, new
 * chat, download transcript, keyboard shortcuts, sound, and conversation
 * search.
 */
export function ScreenHeader({
  hasMessages,
  onReset,
  onDownload,
  fontStepIndex,
  maxFontStepIndex,
  onIncreaseFont,
  onDecreaseFont,
  soundOn,
  onToggleSound,
  messages,
  onJumpToMessage,
}: Props) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return messages.filter((m) => m.content.toLowerCase().includes(q)).slice(0, 8);
  }, [messages, query]);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-2.5 border-b border-navy/10 bg-surface-card/90 px-3 backdrop-blur sm:px-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-navy/15 bg-surface-card">
        <LogoMark className="h-6 w-6" title="" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold leading-tight text-ink">
          <span className="truncate">GovEligify Assistant</span>
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full bg-green ring-2 ring-green-soft"
            aria-label="Online"
            title="Online"
          />
        </p>
        <p className="truncate text-[11px] leading-tight text-ink-faint">
          Not affiliated with any government
        </p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        {/* Text size — hidden on the smallest screens to keep the title readable */}
        <div className="hidden items-center gap-0.5 xs:flex">
          <button
            type="button"
            onClick={onDecreaseFont}
            disabled={fontStepIndex === 0}
            aria-label="Decrease text size"
            title="Decrease text size"
            className={iconButton}
          >
            <span aria-hidden="true" className="text-[11px] font-bold leading-none">
              A<span className="align-super text-[8px]">−</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onIncreaseFont}
            disabled={fontStepIndex === maxFontStepIndex}
            aria-label="Increase text size"
            title="Increase text size"
            className={iconButton}
          >
            <span aria-hidden="true" className="text-sm font-bold leading-none">
              A<span className="align-super text-[9px]">+</span>
            </span>
          </button>
          <span
            aria-hidden="true"
            className="mx-0.5 h-5 w-px bg-navy/15"
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          aria-label="New chat"
          title="New chat"
          className={iconButton}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={!hasMessages}
          aria-label="Download transcript"
          title="Download transcript"
          className={cn(iconButton, "hidden xs:grid")}
        >
          <Download size={17} aria-hidden="true" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShortcutsOpen((v) => !v)}
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts"
            aria-haspopup="menu"
            aria-expanded={shortcutsOpen}
            className={cn(iconButton, "hidden xs:grid")}
          >
            <Keyboard size={17} aria-hidden="true" />
          </button>

          {shortcutsOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShortcutsOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-11 z-40 w-64 animate-fade-in rounded-2xl border border-navy/10 bg-surface-card p-3 text-left shadow-card-lg">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-sm font-bold text-navy-deep">
                    Keyboard shortcuts
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShortcutsOpen(false)}
                    aria-label="Close"
                    className="text-ink-muted transition-colors hover:text-navy"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {SHORTCUTS.map((s) => (
                    <li
                      key={s.keys}
                      className="flex items-center justify-between gap-3 text-xs text-ink-muted"
                    >
                      <span>{s.label}</span>
                      <kbd className="rounded-md border border-navy/15 bg-surface-subtle px-1.5 py-0.5 font-mono text-[11px] text-navy">
                        {s.keys}
                      </kbd>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundOn ? "Mute notification sound" : "Unmute notification sound"}
          title={soundOn ? "Mute notification sound" : "Unmute notification sound"}
          className={cn(iconButton, "hidden xs:grid")}
        >
          {soundOn ? (
            <Volume2 size={17} aria-hidden="true" />
          ) : (
            <VolumeX size={17} aria-hidden="true" />
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search this conversation"
            title="Search this conversation"
            aria-haspopup="menu"
            aria-expanded={searchOpen}
            className={iconButton}
          >
            <Search size={17} aria-hidden="true" />
          </button>

          {searchOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={closeSearch}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-11 z-40 w-72 animate-fade-in rounded-2xl border border-navy/10 bg-surface-card p-3 text-left shadow-card-lg">
                <div className="flex items-center gap-2">
                  <Search
                    size={14}
                    aria-hidden="true"
                    className="shrink-0 text-ink-faint"
                  />
                  <input
                    type="text"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search this conversation…"
                    aria-label="Search this conversation"
                    className="w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close"
                    className="shrink-0 text-ink-muted transition-colors hover:text-navy"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>

                {query.trim() && (
                  <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto scrollbar-thin">
                    {results.length === 0 ? (
                      <li className="px-1 py-2 text-xs text-ink-faint">
                        No matches yet.
                      </li>
                    ) : (
                      results.map((m) => (
                        <li key={m.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onJumpToMessage(m.id);
                              closeSearch();
                            }}
                            className="block w-full truncate rounded-lg px-2 py-1.5 text-left text-xs text-ink-muted transition-colors hover:bg-surface-subtle hover:text-navy"
                          >
                            <span className="font-semibold">
                              {m.role === "user" ? "You: " : "Bot: "}
                            </span>
                            {m.content}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
