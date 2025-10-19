"use client";

import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import EditCardForm from "./EditCardForm";

// create a models.ts file? You know. Decoupling or is it separation of concerns? 🤔
export interface Card {
  id: string;
  front: string;
  back: string;
  showAnswer: boolean;
  tags: string[];
}

export interface CardComponentProps {
  card: Card;
  onToggleAnswer: (id: string) => void;
  onEdit: (id: string, front: string, back: string, tags: string[]) => void;
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function CardComponent({
  card,
  onToggleAnswer,
  onEdit,
  isLoading,
  onDelete,
}: CardComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tagsInput, setTagsInput] = useState<string>(card.tags.join(", "));

  const handleEdit = (front: string, back: string, tags: string[]): void => {
    onEdit(card.id, front, back, tags);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditCardForm
        card={card}
        onSave={handleEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div>
        <div className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
          {/* Card Content */}
          <div className="min-h-[150px] flex items-center justify-center mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            <p className="text-xl font-semibold text-center text-gray-800">
              {card.showAnswer ? card.back : card.front}
            </p>
          </div>

          {/* Button container */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Show Answer Button */}
            <button
              onClick={() => onToggleAnswer(card.id)}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg cursor-pointer font-semibold transition-colors min-w-[120px] ${
                isLoading
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : card.showAnswer
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isLoading
                ? "⏳ Wird geladen..."
                : card.showAnswer
                ? "❌ Antwort verstecken"
                : "✅ Antwort zeigen"}
            </button>
            {/* EditButton */}
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-600"
            >
              <Edit size={18} /> {/* edit icon */}
              <span>Bearbeiten</span>
            </button>
            {/* DeleteButton */}

            <button
              onClick={() => {
                if (
                  confirm(
                    `Möchtest du diese Karte wirklich löschen?\n\n"${card.front}"`
                  )
                ) {
                  onDelete(card.id);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-red-500 rounded-lg cursor-pointer hover:bg-red-600"
            >
              <Trash2 size={18} />
              <span>Löschen</span>
            </button>
          </div>
          {/* Tags Display*/}
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {card.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
