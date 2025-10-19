"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface TagFilterProps {
  allTags: string[];
  tagCounts: Record<string, number>;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

/**
 * Searchbare Dropdown-Komponente zum Filtern nach Tags
 * - Zeigt alle verfügbaren Tags
 * - Erlaubt Multi-Select
 * - Mit Suchfunktion
 */
export default function TagFilter({
  allTags,
  tagCounts,
  selectedTags,
  onTagsChange,
}: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Filtere Tags basierend auf Suchtext
   */
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(searchInput.toLowerCase())
  );

  /**
   * Toggle Tag in der Auswahl
   */
  const toggleTag = (tag: string): void => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  /**
   * Schließe Dropdown wenn außerhalb geklickt wird
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          🏷️ Nach Tags filtern
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={() => onTagsChange([])}
            className="px-3 py-1 text-xs text-gray-700 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
          >
            ❌ Filter löschen
          </button>
        )}
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full"
            >
              {tag}
              <button
                onClick={() => toggleTag(tag)}
                className="hover:bg-blue-600 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 transition-colors border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:border-blue-500"
        >
          <span className="text-gray-700">
            {selectedTags.length > 0
              ? `${selectedTags.length} Tag${
                  selectedTags.length !== 1 ? "s" : ""
                } ausgewählt`
              : "Tags zum Filtern wählen..."}
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg top-full">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="🔍 Tags durchsuchen..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            {/* Tag List */}
            <div className="overflow-y-auto max-h-64">
              {filteredTags.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Keine Tags gefunden
                </div>
              ) : (
                filteredTags.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center px-4 py-3 transition-colors border-b border-gray-100 cursor-pointer hover:bg-blue-50 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="flex-1 ml-3 font-medium text-gray-800">
                      {tag}
                    </span>
                    <span className="text-xs text-gray-500">
                      {tagCounts[tag] || 0}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Text */}
      {allTags.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          💡 {allTags.length} Tag{allTags.length !== 1 ? "s" : ""} verfügbar
        </p>
      )}
    </div>
  );
}
