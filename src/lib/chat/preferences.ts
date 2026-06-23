"use client";

import type { LangCode } from "@/lib/types";

/**
 * Persisted, /chat-scoped UI preferences (text size, notification sound,
 * UI language). Every getter/setter is a thin localStorage wrapper that
 * silently falls back to defaults on the server, in private-browsing, or
 * over quota.
 */

const FONT_STEP_KEY = "goveligify-chat-font-step";
const SOUND_KEY = "goveligify-chat-sound";
const LANG_KEY = "goveligify-chat-lang";

/** Root font-size percentages selectable via the header's A−/A+ controls. */
export const FONT_SCALE_STEPS = [87.5, 100, 112.5, 125, 137.5] as const;
export const DEFAULT_FONT_STEP_INDEX = 1; // 100%

export function getStoredFontStepIndex(): number {
  try {
    const n = Number(localStorage.getItem(FONT_STEP_KEY));
    return Number.isInteger(n) && n >= 0 && n < FONT_SCALE_STEPS.length
      ? n
      : DEFAULT_FONT_STEP_INDEX;
  } catch {
    return DEFAULT_FONT_STEP_INDEX;
  }
}

export function storeFontStepIndex(index: number): void {
  try {
    localStorage.setItem(FONT_STEP_KEY, String(index));
  } catch {
    /* ignore quota / disabled storage */
  }
}

export function getStoredSoundOn(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}

export function storeSoundOn(on: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
}

const VALID_LANGS: LangCode[] = ["en", "ta", "hi", "ml", "kn", "te", "mr", "ur", "sa", "bn"];

export function getStoredLang(): LangCode {
  try {
    const v = localStorage.getItem(LANG_KEY) as LangCode | null;
    return v && VALID_LANGS.includes(v) ? v : "en";
  } catch {
    return "en";
  }
}

export function storeLang(lang: LangCode): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}
