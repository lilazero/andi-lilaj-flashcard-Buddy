import { useState } from "react";
import { Card } from "./CardComponent";
import { X } from "lucide-react";

interface EditCardFormProps {
  card: Card;
  onSave: (front: string, back: string, tags: string[]) => void;
  onCancel: () => void;
}

export default function EditCardForm({
  card,
  onSave,
  onCancel,
}: EditCardFormProps) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [tagsInput, setTagsInput] = useState<string>(card.tags.join(", "));

  const parseTags = (input: string): string[] => {
    return input
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);
  };

  /**
   * Verarbeite Speichern
   */
  const handleSave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const tags = parseTags(tagsInput);
    console.log(
      `[EditCardForm] Karte aktualisiert: "${front}" <-> "${back}" mit Tags: 
      ${JSON.stringify(tags)}`
    );
    onSave(front, back, tags);
  };

  return (
    <div className="p-6 bg-card border-2 border-secondary rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-foreground">
          ✏️ Karte bearbeiten
        </h3>
        <button
          onClick={onCancel}
          className="p-1 transition-colors rounded cursor-pointer hover:bg-input/10"
          title="Abbrechen"
        >
          <X size={24} className="text-muted-foreground cursor-pointer" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Front Input */}
        <div>
          <label
            htmlFor="edit-front"
            className="block mb-2 text-sm font-semibold text-foreground"
          >
            📄Vorderseite (Frage)
          </label>
          <input
            id="edit-front"
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="w-full px-4 py-3 transition-colors border-2 border-input rounded-lg focus:outline-none focus:border-secondary"
          />
        </div>

        {/* Back Input */}
        <div>
          <label
            htmlFor="edit-back"
            className="block mb-2 text-sm font-semibold text-foreground"
          >
            📲Rückseite (Antwort)
          </label>
          <input
            id="edit-back"
            type="text"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className="w-full px-4 py-3 transition-colors border-2 border-input rounded-lg focus:outline-none focus:border-secondary"
          />
        </div>
        {/* Tags Input */}
        <div>
          <label
            htmlFor="edit-tags"
            className="block mb-2 text-sm font-semibold text-foreground"
          >
            🏷️ Tags (komma-getrennt, optional)
          </label>
          <input
            id="edit-tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="z.B. 'HTML, Web, Anfänger'"
            className="w-full px-4 py-3 transition-colors border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          {tagsInput && (
            <div className="flex flex-wrap gap-2 mt-2">
              {parseTags(tagsInput).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-semibold text-secondary-foreground bg-secondary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Button Container */}
        <div className="flex gap-3 mt-6">
          {/* Save Button */}
          <button
            type="submit"
            className="flex-1 px-4 py-3 font-semibold text-primary-foreground transition-all transform rounded-lg cursor-pointer bg-primary hover:bg-primary/90 active:scale-95"
          >
            💾 Speichern
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 font-semibold text-muted-foreground transition-colors bg-border rounded-lg cursor-pointer hover:bg-border/80"
          >
            ❌ Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
