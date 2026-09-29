"use client";

import { useSyncExternalStore } from "react";

// The visitor's shortlist of favourite pieces, kept in this browser only.
// It is a convenience, so storage failures (private mode, blocked storage) are ignored.

const KEY = "aac-shortlist";
const EVENT = "aac:shortlist";
const EMPTY: string[] = [];

let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY;

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cachedIds;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      cachedIds = Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : EMPTY;
    } catch {
      cachedIds = EMPTY;
    }
  }
  return cachedIds;
}

function write(ids: string[]) {
  cachedIds = ids;
  try {
    cachedRaw = JSON.stringify(ids);
    window.localStorage.setItem(KEY, cachedRaw);
  } catch {
    // Keep the in-memory list for this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useShortlist() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) => write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
    remove: (id: string) => write(ids.filter((x) => x !== id)),
    clear: () => write([]),
  };
}
