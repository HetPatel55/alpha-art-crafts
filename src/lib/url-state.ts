"use client";

import { useCallback, useSyncExternalStore } from "react";

// Tiny query-string state: ?page=2&filter=florals&view=design-04.
// Keeping gallery state in the URL means the phone's Back button, refreshes and
// shared links all land on the same page, filter and photo.

const EVENT = "aac:urlchange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function useSearchParams() {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );

  const get = useCallback((key: string) => new URLSearchParams(search).get(key), [search]);

  /** Update params; `null` removes one. `push` adds a history entry (Back undoes it). */
  const set = useCallback((changes: Record<string, string | null>, { push = false } = {}) => {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    if (push) window.history.pushState({ aac: true }, "", url);
    else window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { get, set };
}
