"use client";

import { Trash2, Edit, Check, X } from "lucide-react";
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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleEdit = (front: string, back: string, tags: string[]): void => {
    onEdit(card.id, front, back, tags);
    setIsEditing(false);
  };

  const handleDeleteClick = (): void => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = (): void => {
    onDelete(card.id);
    setIsConfirmingDelete(false);
  };

  const handleCancelDelete = (): void => {
    setIsConfirmingDelete(false);
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
        <div className="p-6 transition-shadow bg-card rounded-lg shadow-md hover:shadow-lg">
          {/* Card Content */}
          <div className="min-h-[150px] flex items-center justify-center mb-4 rounded-lg p-6 bg-input/5">
            <p className="text-xl font-semibold text-center text-foreground">
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
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : card.showAnswer
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
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
              className="flex items-center gap-2 px-4 py-2 font-semibold text-secondary-foreground transition-colors bg-secondary rounded-lg cursor-pointer hover:bg-secondary/90"
            >
              <Edit size={18} /> {/* edit icon */}
              <span>Bearbeiten</span>
            </button>

            {/* Delete Button - shows confirm/cancel when clicked */}
            {!isConfirmingDelete ? (
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors bg-destructive rounded-lg hover:bg-destructive/90"
              >
                <Trash2 size={18} />
                <span>Löschen</span>
              </button>
            ) : (
              <div className="flex gap-2">
                {/* Confirm Delete */}
                <button
                  onClick={handleConfirmDelete}
                  className="flex items-center gap-2 px-4 py-2 font-semibold text-card-foreground transition-colors bg-chart-1 rounded-lg hover:bg-chart-1/90"
                  title="Löschen bestätigen"
                >
                  <Check size={18} />
                  <span>Bestätigen</span>
                </button>
                {/* Cancel Delete */}
                <button
                  onClick={handleCancelDelete}
                  className="flex items-center gap-2 px-4 py-2 font-semibold text-muted-foreground transition-colors bg-border rounded-lg hover:bg-border/80"
                  title="Abbrechen"
                >
                  <X size={18} />
                  <span>Abbrechen</span>
                </button>
              </div>
            )}
          </div>
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {card.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-semibold text-accent-foreground bg-accent rounded-full"
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
