"use client";
import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

interface AddCardFormProps {
  onAddCard: (front: string, back: string, tags: string[]) => void;
}

/**
 * Parse komma-getrennte Tags in ein Array
 * - Entfernt Duplikate
 * - Trimmt Whitespace
 * - Filtert leere Werte
 */
const parseTags = (input: string): string[] => {
  const tagSet = new Set<string>();
  input
    .split(",")
    .map((tag) => tag.trim().toLowerCase()) // lowercase für Vergleich
    .filter((tag) => tag.length > 0)
    .forEach((tag) => tagSet.add(tag));
  return Array.from(tagSet);
};

export default function AddCardForm({ onAddCard }: AddCardFormProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [tagsInput, setTagsInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = parseTags(tagsInput);
    console.log(
      `[AddCardForm] Neue Karte wird hinzugefügt: "${front}" <~~~~> "${back}" mit Tags: ${JSON.stringify(
        tags
      )}`
    );
    //reset form
    onAddCard(front, back, tags);
    setFront("");
    setBack("");
    setTagsInput("");
    console.log("[AddCardForm] Formular emptied");
    setIsOpen(false);
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-6 py-4 transition-colors rounded-lg hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">
            ➕ Neue Karte hinzufügen
          </h2>
        </div>
        <ChevronDown
          size={24}
          className={`text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Collapsible Form Content */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="pt-6 space-y-4 border-t border-gray-200">
            <label className="block mb-2 text-sm font-semibold text-gray-700 cursor-pointer">
              📄 Vorseite:
              <input
                id="front"
                type="text"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Gib eine Frage ein (z.B. 'Was ist HTML?')"
                className="w-full px-4 py-3 transition-colors border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 cursor-pointer">
              📲 Rückseite:
              <input
                id="back"
                type="text"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Gib die Antwort ein (z.B. 'HyperText Markup Language')"
                className="w-full px-4 py-3 transition-colors border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>
          {/* Tags Input */}
          <>
            <label
              htmlFor="tags"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              🏷️ Tags (komma-getrennt, optional)
            </label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="z.B. 'HTML, Web, Anfänger' (optional)"
              className="w-full px-4 py-3 transition-colors border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {/* Tag Preview */}
            <div className="flex flex-wrap h-5 gap-2 mt-2">
              {tagsInput && (
                <>
                  {parseTags(tagsInput).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )}
            </div>
          </>
          <button
            type="submit"
            className="w-full px-4 py-3 mt-3 font-semibold text-white transition-all transform rounded-lg cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 active:scale-95"
          >
            ✨ Karte hinzufügen
          </button>
        </form>
      )}
    </div>
  );
}
