"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "slg_favorites";

// Per-browser "saved pieces" list — no account/login needed. Reads/writes
// localStorage directly, so it's private to this visitor's device and never
// touches the server. Safe to call from multiple components at once; each
// mounted instance re-syncs on the "storage" event and on its own writes.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const read = useCallback((): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    setFavorites(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [read]);

  const write = useCallback((next: string[]) => {
    setFavorites(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing / storage disabled: state still updates for this
      // session, it just won't persist across reloads.
    }
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id: string) => {
      write(favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]);
    },
    [favorites, write]
  );

  return { favorites, isFavorite, toggleFavorite, ready };
}
