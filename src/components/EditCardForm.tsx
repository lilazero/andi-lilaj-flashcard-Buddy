import { useState } from "react";
import { Card } from "./CardComponent";
import { X } from "lucide-react";

interface EditCardFormProps{
  card: Card;
  onSave: (front: string, back: string) => void;
  onCancel: () => void;
}

export default function EditCardForm({ card, onSave, onCancel }: EditCardFormProps) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  /**
   * Verarbeite Speichern
   */
  const handleSave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSave(front, back);
  }

return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-purple-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800">✏️ Karte bearbeiten</h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Abbrechen"
        >
          <X size={24} className="text-gray-600 cursor-pointer hover:border-2" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Front Input */}
        <div>
          <label htmlFor="edit-front" className="block text-sm font-semibold text-gray-700 mb-2">
            📄Vorderseite (Frage)
          </label>
          <input
            id="edit-front"
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Back Input */}
        <div>
          <label htmlFor="edit-back" className="block text-sm font-semibold text-gray-700 mb-2">
            📲Rückseite (Antwort)
          </label>
          <input
            id="edit-back"
            type="text"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Button Container */}
        <div className="flex gap-3 mt-6">
          {/* Save Button */}
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95"
          >
            💾 Speichern
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            ❌ Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
