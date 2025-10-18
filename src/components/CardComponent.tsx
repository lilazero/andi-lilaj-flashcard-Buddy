"use client";

import { Edit } from "lucide-react";
import { useState } from "react";
import EditCardForm from "./EditCardForm";

// create a models.ts file? You know. Decoupling or is it separation of concerns? 🤔
export interface Card {
  id: string;
  front: string;
  back: string;
  showAnswer: boolean;
}

//TODO: add onDelete, OnEdit props etc.
export interface CardComponentProps {
  card: Card;
  onToggleAnswer: (id: string) => void;
  onEdit: (id: string, front: string, back: string) => void;
  isLoading: boolean;
}

export function CardComponent({
  card,
  onToggleAnswer,
  onEdit,
  isLoading,
}: CardComponentProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (front: string, back: string): void => {
    onEdit(card.id, front, back);
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
      <h1>CardComponent</h1>
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
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors min-w-[120px] ${
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
              className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-purple-500 rounded-lg hover:bg-purple-600"
            >
              <Edit size={18} /> {/* edit icon */}
              <span>Bearbeiten</span>
            </button>
            {/* DeleteButton */}
          </div>
        </div>
      </div>
    </>
  );
}
