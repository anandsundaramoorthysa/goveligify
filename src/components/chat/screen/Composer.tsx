"use client";

import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowUp,
  ChevronDown,
  Info,
  Languages,
  Mic,
  MicOff,
  Square,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LangCode } from "@/lib/types";
import { LANGUAGES, SPEECH_LOCALE, STRINGS } from "@/lib/chat/translations";

interface Props {
  onSend: (text: string) => void;
  onStop: () => void;
  pending: boolean;
  lang: LangCode;
  onLangChange: (lang: LangCode) => void;
}

const MAX_HEIGHT_PX = 140;
const MAX_LEN = 1000;
/** Safety net so a stalled permission prompt / silent driver can't leave the
 * mic stuck showing "listening" forever with no feedback. */
const MIC_TIMEOUT_MS = 8000;

interface SpeechRecognitionResultLike {
  results: { [index: number]: { [index: number]: { transcript: string } } } & {
    length: number;
  };
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionResultLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: SpeechRecognitionErrorLike) => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Bottom composer: language selector + mic dictation + auto-grow textarea +
 * circular send/stop button, plus a centered trust line with a "How this
 * works" popover. Forwards a ref to the textarea so the parent can
 * implement the "/" focus shortcut.
 */
export const Composer = forwardRef<HTMLTextAreaElement, Props>(function Composer(
  { onSend, onStop, pending, lang, onLangChange },
  ref,
) {
  const [value, setValue] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<
    "unknown" | "granted" | "denied" | "prompt"
  >("unknown");
  const [showBlockedHelp, setShowBlockedHelp] = useState(false);
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const micTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = STRINGS[lang];

  useEffect(() => {
    setMicSupported(getSpeechRecognition() !== null);
  }, []);

  // Watch the browser's stored mic permission so that once the user fixes a
  // block from outside the page (browser site settings), our "blocked" UI
  // clears itself without needing a reload. This is observational only — it
  // never gates the mic button, since some browsers (notably Edge) can
  // report "denied" here even when the real, user-gesture-triggered request
  // would succeed or correctly show the native permission prompt.
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) return;
    let result: PermissionStatus | null = null;
    let cancelled = false;
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        if (cancelled) return;
        result = status;
        status.onchange = () => {
          if (status.state !== "denied") {
            setMicPermission("granted");
            setShowBlockedHelp(false);
          }
        };
      })
      .catch(() => {
        /* "microphone" isn't a queryable permission in this browser */
      });
    return () => {
      cancelled = true;
      if (result) result.onchange = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
    };
  }, []);

  // Auto-dismiss the mic error toast.
  useEffect(() => {
    if (!micError) return;
    const id = setTimeout(() => setMicError(null), 4000);
    return () => clearTimeout(id);
  }, [micError]);

  function clearMicTimeout() {
    if (micTimeoutRef.current) {
      clearTimeout(micTimeoutRef.current);
      micTimeoutRef.current = null;
    }
  }

  function stopListening(error?: string) {
    clearMicTimeout();
    setListening(false);
    if (error) setMicError(error);
  }

  function toggleMic() {
    if (listening) {
      recognitionRef.current?.stop();
      stopListening();
      return;
    }
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      setMicError("Voice input isn't supported in this browser.");
      return;
    }

    setMicError(null);
    setShowBlockedHelp(false);
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = SPEECH_LOCALE[lang];
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1]?.[0]?.transcript ?? "";
      if (transcript) {
        setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onend = () => stopListening();
    recognition.onerror = (e) => {
      const blocked = e?.error === "not-allowed" || e?.error === "service-not-allowed";
      if (blocked) {
        setMicPermission("denied");
        setShowBlockedHelp(true);
        stopListening();
      } else {
        stopListening("Didn't catch that — please try again.");
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
      clearMicTimeout();
      micTimeoutRef.current = setTimeout(() => {
        recognitionRef.current?.stop();
        stopListening("Didn't catch that — please try again.");
      }, MIC_TIMEOUT_MS);
    } catch {
      setListening(false);
      setMicError("Couldn't start voice input — please try again.");
    }
  }

  const setRefs = (el: HTMLTextAreaElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT_PX ? "auto" : "hidden";
  }, [value]);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const text = value.trim();
    if (!text || pending) return;
    onSend(text);
    setValue("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const hasText = value.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={submit}
        className="flex flex-col gap-2 rounded-2xl border border-navy/15 bg-surface-card px-3 py-2 shadow-card-lg transition-shadow focus-within:border-navy/30"
      >
        <label htmlFor="screen-composer" className="sr-only">
          Describe your situation
        </label>
        <textarea
          id="screen-composer"
          ref={setRefs}
          rows={1}
          value={value}
          maxLength={MAX_LEN}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.composerPlaceholder}
          aria-label="Message"
          className="block w-full resize-none border-0 bg-transparent px-1 py-1 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint scrollbar-thin"
          style={{ maxHeight: MAX_HEIGHT_PX }}
        />

        {/* Language + mic sit below the message box, matching the reference layout */}
        <div className="flex items-center gap-1">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Choose language"
              title="Choose language"
              aria-haspopup="menu"
              aria-expanded={langOpen}
              className="flex h-9 items-center gap-1 rounded-full border border-navy/15 px-2 text-ink-muted transition-colors hover:bg-surface-subtle hover:text-navy"
            >
              <Languages size={16} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase">{lang}</span>
              <ChevronDown
                size={12}
                aria-hidden="true"
                className={cn("transition-transform", langOpen && "rotate-180")}
              />
            </button>

            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setLangOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute bottom-11 left-0 z-40 max-h-64 w-36 animate-fade-in overflow-y-auto rounded-2xl border border-navy/10 bg-surface-card p-1.5 shadow-card-lg scrollbar-thin">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        onLangChange(l.code);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-surface-subtle",
                        l.code === lang
                          ? "font-semibold text-navy"
                          : "text-ink-muted",
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {micSupported && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={toggleMic}
                aria-label={
                  micPermission === "denied"
                    ? "Microphone blocked — tap for help"
                    : listening
                      ? t.micStop
                      : t.micStart
                }
                title={
                  micPermission === "denied"
                    ? "Microphone blocked — tap for help"
                    : listening
                      ? t.micStop
                      : t.micStart
                }
                aria-haspopup={micPermission === "denied" ? "menu" : undefined}
                aria-expanded={micPermission === "denied" ? showBlockedHelp : undefined}
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
                  micPermission === "denied"
                    ? "text-red-500 hover:bg-red-50"
                    : listening
                      ? "animate-pulse bg-saffron/20 text-saffron-deep"
                      : "text-ink-muted hover:bg-surface-subtle hover:text-navy",
                )}
              >
                {micPermission === "denied" || listening ? (
                  <MicOff size={17} aria-hidden="true" />
                ) : (
                  <Mic size={17} aria-hidden="true" />
                )}
              </button>

              {micError && (
                <div
                  role="status"
                  className="absolute bottom-11 left-1/2 z-40 w-52 -translate-x-1/2 animate-fade-in rounded-xl bg-navy-deep px-3 py-2 text-center text-xs leading-snug text-white shadow-card-lg"
                >
                  {micError}
                </div>
              )}

              {showBlockedHelp && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowBlockedHelp(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-11 left-0 z-40 w-64 animate-fade-in rounded-2xl border border-navy/10 bg-surface-card p-3 text-left shadow-card-lg">
                    <p className="text-xs font-semibold text-navy-deep">
                      Microphone is blocked for this site
                    </p>
                    <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-[11px] leading-snug text-ink-muted">
                      <li>
                        Click the mic icon to the left of the address bar
                        (next to the page-info icon).
                      </li>
                      <li>Set &ldquo;Microphone&rdquo; to Allow.</li>
                      <li>Then tap &ldquo;Try again&rdquo; below.</li>
                    </ol>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBlockedHelp(false);
                          toggleMic();
                        }}
                        className="text-[11px] font-semibold text-navy underline-offset-2 hover:underline"
                      >
                        Try again
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBlockedHelp(false)}
                        className="text-[11px] font-semibold text-ink-muted underline-offset-2 hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {listening && (
            <span
              role="status"
              className="flex items-center gap-1.5 rounded-full bg-saffron/15 px-2.5 py-1 text-[11px] font-semibold text-saffron-deep"
            >
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-saffron-deep" />
              {t.micListening}
            </span>
          )}

          <div className="flex-1" />

          {pending ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-navy/15 text-ink-muted transition-transform active:scale-90"
            >
              <Square size={16} fill="currentColor" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!hasText}
              aria-label="Send message"
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-white transition-all active:scale-90 disabled:opacity-40",
                hasText &&
                  "shadow-[0_0_0_3px_rgba(255,153,51,0.25),0_4px_14px_rgba(255,153,51,0.35)] hover:bg-navy-light",
              )}
            >
              <ArrowUp size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {/* Trust line + how-it-works popover */}
      <div className="relative mt-2 flex items-center justify-center gap-1.5 px-2">
        <p className="text-center text-[11px] leading-snug text-ink-faint">
          {t.trustLine}
        </p>
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          aria-label="How this works"
          aria-expanded={showHelp}
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:text-navy"
        >
          <Info size={14} aria-hidden="true" />
        </button>

        {showHelp && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowHelp(false)}
              aria-hidden="true"
            />
            <div className="absolute bottom-8 left-1/2 z-40 w-[min(92vw,22rem)] -translate-x-1/2 animate-fade-in rounded-2xl border border-navy/10 bg-surface-card p-4 text-left shadow-card-lg">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-sm font-bold text-navy-deep">
                  How this works
                </h2>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  aria-label="Close"
                  className="text-ink-muted transition-colors hover:text-navy"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Describe your situation and GovEligify matches you to sample
                government schemes and certificates, with the documents you&apos;ll
                need and a link to the official portal. This is a sample
                experience — replies are illustrative, so always confirm details
                on the official site. We never submit applications for you.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
