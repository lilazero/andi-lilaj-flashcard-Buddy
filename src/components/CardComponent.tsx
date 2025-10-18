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
}

export function CardComponent({ card, onToggleAnswer, onEdit }: CardComponentProps) {

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
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          {/* Card Content */}
          <div className="min-h-[150px] flex items-center justify-center mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            <p className="text-xl text-gray-800 font-semibold text-center">
              {card.showAnswer ? card.back : card.front}
            </p>
          </div>

          {/* Button container */}
          <div className="flex gap-3 justify-between items-center flex-wrap">
            {/* Show Answer Button */}
            <button
              onClick={() => onToggleAnswer(card.id)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors min-w-[120px] ${
                card.showAnswer
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {card.showAnswer ? "❌ Antwort verstecken" : "✅ Antwort zeigen"}
            </button>
            {/* EditButton */}
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2"
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
