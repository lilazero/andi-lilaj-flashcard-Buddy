"use client";

import AddCardForm from "./AddCardForm";
import { Card, CardComponent } from "./CardComponent";
import TagFilter from "./TagFilter";
import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "flashcard_buddy_cards";

export default function FlashcardBuddy() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleAnswer = (id: string): void => {
    console.log(`[toggleAnswer] Attempt to fetch card with id: ${id}...`);

    setLoadingCardId(id);

    setTimeout(() => {
      setCards(
        cards.map((card) =>
          card.id === id ? { ...card, showAnswer: !card.showAnswer } : card
        )
      );
      setLoadingCardId(null);
      //TODO: es auf 500 bis 700 ändern, wie es im PDF verlangt ist. Im Moment ist es ok 500 ist zu langsam
    }, 200);
  };

  const addCard = (front: string, back: string, tags: string[]): void => {
    // Validierung
    // cuz with !front and !back it was possible to add whitespace cards
    if (front.trim() === "" || back.trim() === "") {
      alert(
        "Bitte füllen Sie sowohl die Vorder- als auch die Rückseite der Karte aus."
      );
      return;
    }

    const newCard: Card = {
      //random uuid but it's nextjs client side ? can it be susceptible to attacks?
      id: crypto.randomUUID(),
      front,
      back,
      showAnswer: false,
      tags: tags,
    };
    setCards([...cards, newCard]);
  };

  //* localStorage is available in any client-side context, but not during server-side rendering (SSR), since it's a browser API.
  //* Which means to integrate XATA or some other database i have to burn this all to the ground and start over.
  //* also load then save otherwise it saves an empty array over the one that's supposed to be loaded than it loads the empty one

  /*  Load cards from localStorage on component mount */
  const loadFromStorage = (): void => {
    try {
      const storedCards = localStorage.getItem(STORAGE_KEY);
      if (storedCards) {
        const parsedCards = JSON.parse(storedCards) as Card[];
        console.log(
          `[loadFromStorage] Loaded ${parsedCards.length} cards from localStorage.`
        );
        setCards(parsedCards);
      } else {
        console.log("[loadFromStorage] No cards found in localStorage.");
      }
    } catch (error) {
      console.error(
        "[loadFromStorage] Error loading cards from localStorage:",
        error
      );
      setCards([]); // Reset to empty array on error // TODO!: Change when implementing database
    } finally {
      console.log("[loadFromStorage] Load attempt finished.");
    }
  };

  useEffect(() => {
    console.log(
      "[FlashcardBuddy] loadFromStorage called on component mount..."
    );
    loadFromStorage();
  }, []);

  /*  Save To Storage function */
  const saveToStorage = (cardsToSave: Card[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsToSave));
      console.log(
        `[saveToStorage] ${cardsToSave.length} Cards saved to localStorage.`
      );
      //  For detailed logging in development, uncomment the following:
      //  if (process.env.NODE_ENV === "development") {
      //  console.log(`[saveToStorage] Card IDs: ${cardsToSave.map(card => card.id).join(", ")}`);
    } catch (err) {
      console.error("[saveToStorage] Error saving cards to localStorage:", err);
    } finally {
      console.log("[saveToStorage] Save attempt finished.");
    }
  };

  /* Save to Storage side-effect function*/
  // Speichern der Karten in localStorage bei jeder Änderung
  // Using useRef to skip initial save on component mount. overkill
  // ! if it breaks again use useEffects saveToStorage(cards) without any conditions
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    saveToStorage(cards);
  }, [cards]);

  const updateCard = (
    id: string,
    front: string,
    back: string,
    tags: string[]
  ): void => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, front, back, tags } : card
      )
    );
  };

  const deleteCard = (id: string): void => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const deleteAllCards = (): void => {
    if (cards.length === 0) {
      alert("Es gibt keine Karten zum Löschen!");
      return;
    }

    if (confirm(`Möchtest du wirklich alle ${cards.length} Karten löschen?`)) {
      setCards([]);
      console.log("[deleteAllCards] Alle Karten wurden gelöscht");
    }
  };

  /**
   * fetch alle einzigartigen Tags aus den Karten
   */
  const getAllTags = (): string[] => {
    const tagSet = new Set<string>();
    cards.forEach((card) => {
      card.tags.forEach((tag) => {
        tagSet.add(tag);
      });
    });
    return Array.from(tagSet).sort();
  };

  /**
   * Zähle wie viele Karten jeden Tag hat
   * - Gibt ein Object mit Tag-Namen als Keys und Kartenzahl als Values
   */
  const getTagCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {};
    cards.forEach((card) => {
      card.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  };

  /**
   * Filtere Karten basierend auf ausgewählten Tags
   * - Wenn keine Tags ausgewählt: alle Karten anzeigen
   * - Wenn Tags ausgewählt: nur Karten mit mind. einem dieser Tags anzeigen
   */
  const getFilteredCards = (): Card[] => {
    if (selectedTags.length === 0) {
      return cards;
    }
    return cards.filter((card) =>
      card.tags.some((tag) => selectedTags.includes(tag))
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">
            📚 Flashcard Buddy
          </h1>
          <p className="text-gray-600">
            Lerne effektiv mit digitalen Karteikarten
          </p>
        </div>

        {/* Add Card Form */}
        <AddCardForm onAddCard={addCard} />

        {/* Card Count and Info */}
        <div className="mb-6 text-sm text-center text-gray-600">
          {cards.length > 0 && (
            <>
              {/* Etwas wie 🔎 Du hast X Karten dann ob es gibt ein filter (Y mit Filtern angezeigt) */}
              <span>
                Du hast <strong>{cards.length}</strong> Karten
              </span>
              <span className="ml-3">{/* (Y shown wegen Filtern) */}</span>
            </>
          )}
        </div>

        {/* Tag Filter , nur anzeigen wenn es karten gibt, oder auch ein search dass durch alles sucht,
         */}
        {/* <TagFilter> und oder <SearchBar /> */}
        {cards.length > 0 && getAllTags().length > 0 && (
          <TagFilter
            allTags={getAllTags()}
            tagCounts={getTagCounts()}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        )}

        {/* Card List or Empty State or there wont be the opportunity for an Empty State
         */}

        {/* Card List or Empty State */}
        <div className="space-y-4">
          {cards.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <p className="mb-4 text-lg text-gray-600">
                🎓 Noch keine Karten vorhanden. Füge deine erste Karte hinzu!
              </p>
            </div>
          ) : getFilteredCards().length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <p className="mb-4 text-lg text-gray-600">
                🔍 Keine Karten mit diesen Tags gefunden.
              </p>
            </div>
          ) : (
            <>
              {getFilteredCards().map((card) => (
                <CardComponent
                  key={card.id}
                  card={card}
                  onToggleAnswer={toggleAnswer}
                  onDelete={deleteCard}
                  onEdit={updateCard}
                  isLoading={loadingCardId === card.id}
                />
              ))}
            </>
          )}
        </div>

        {/* Delete All Button only if cards.length > 0 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              deleteAllCards();
            }}
            className="px-6 py-3 font-semibold text-white transition-colors bg-red-500 rounded-lg cursor-pointer hover:bg-red-600"
          >
            🗑️ Alle Karten löschen
          </button>
        </div>
      </div>
    </div>
  );
}
