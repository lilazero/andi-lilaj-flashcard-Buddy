"use client";

import { useId } from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  const inputId = useId();

  return (
    <div
      className="cursor-pointer"
      /* Das Klicken auf „div“ (nicht nur auf label durch for=id) focusiert sich auf die Suchfeld und erleichtert Handynutzers die Experience */
      onClick={() => {
        document.getElementById(inputId)?.focus();
      }}
    >
      <label className="block py-2 text-sm font-semibold text-foreground cursor-pointer">
        🔎 Suche in Karten (Frage, Antwort, Tags)
      </label>
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Tippe, um zu suchen..."
        className="w-full px-4 py-3 transition-colors border-2 border-input rounded-lg focus:outline-none focus:border-accent"
      />
    </div>
  );
}
