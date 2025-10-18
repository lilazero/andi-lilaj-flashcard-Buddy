"use client";

// create a models.ts file? You know. Decoupling or is it separation of concerns? 🤔
export interface Card {
  id: number;
  front: string; 
  back: string; 
  showAnswer: boolean;
}

//TODO: add onDelete, OnEdit props etc.
export interface CardComponentProps {
  card: Card;
  onToggleAnswer: (id: number) => void; 
}

export function CardComponent({ card, onToggleAnswer }: CardComponentProps) {
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

          <div className="flex gap-3 justify-between items-center flex-wrap">{/* fit nicely with edit and other buttons later */} 
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
          </div>
        </div>
      </div>
    </>
  );
}
