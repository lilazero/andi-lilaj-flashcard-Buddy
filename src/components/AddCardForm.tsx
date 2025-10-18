"use client";
import { useState } from "react";

interface AddCardFormProps {
  onAddCard: (front: string, back: string) => void;
}

export default function AddCardForm({ onAddCard }: AddCardFormProps) {

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCard(front, back);
    setFront("");
    setBack("");
  };

  return (
    <form onSubmit={handleSubmit}
    //so much for tailwind's utility first approach
    // * research how to make tailwind classes from tailwind classes that are made from css classes that are made from c++
    className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Neue Karte hinzufügen</h2>
      <div className="space-y-4"
      >
          <label className="block text-sm font-semibold text-gray-700 mb-2 cursor-pointer">
          📄 Vorseite:
          <input
            id="front"
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Gib eine Frage ein (z.B. 'Was ist HTML?')"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </label>
      </div>
      <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 cursor-pointer">
          📲 Rückseite:
          <input
            id="back"
            type="text"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Gib die Antwort ein (z.B. 'HyperText Markup Language')"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </label>
      </div>
        <button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 active:scale-95"
        >
          ✨ Karte hinzufügen
        </button>
    </form>
  );
}