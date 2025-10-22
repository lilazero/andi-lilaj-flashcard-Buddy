"use client";

import { toast } from "sonner";
import AddCardForm from "./AddCardForm";
import { Card, CardComponent } from "./CardComponent";
import TagFilter from "./TagFilter";
import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import { ModeToggle } from "./theme-button";

const STORAGE_KEY = "flashcard_buddy_cards";

export default function FlashcardBuddy() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [includeAllTags, setIncludeAllTags] = useState<boolean>(false);

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
    }, 500);
  };

  const addCard = (front: string, back: string, tags: string[]): void => {
    // Validierung
    // cuz with !front and !back it was possible to add whitespace cards
    if (front.trim() === "" || back.trim() === "") {
      toast.error("Bitte fülle Frage und Antwort aus!");
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
    toast.success("Karte erfolgreich hinzugefügt!");
    setCards([...cards, newCard]);
  };

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
      setCards([]); // Reset to empty array on error
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
      // Remove showAnswer property before saving (it's just UI state)
      const cardsToStore = cardsToSave.map(({ showAnswer, ...card }) => card);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsToStore));
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
  // FIXME:and it saves everything every time a card is changed which is not optimal
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
    toast.success("Karte erfolgreich aktualisiert!");
    console.log(`[updateCard] Karte mit der ID ${id} wurde aktualisiert.`);
  };

  /**
   * Removes a flashcard with the specified id from the local cards state.
   *
   * Updates state by creating a new array that excludes any card whose `id`
   * matches the provided `id`. If no matching card is found, the state is left unchanged.
   *
   * @param id - The identifier of the card to remove.
   * @returns void
   */
  const deleteCard = (id: string): void => {
    setCards(cards.filter((card) => card.id !== id));
    toast.warning("Karte wurde gelöscht!");
    console.log(`[deleteCard] Karte mit der ID ${id} wurde gelöscht.`);
  };

  const deleteAllCards = (): void => {
    if (cards.length === 0) {
      toast.error("Es gibt keine Karten zu löschen!");
      return;
    }

    if (confirm(`Möchtest du wirklich alle ${cards.length} Karten löschen?`)) {
      setCards([]);
      toast.warning("Alle Karten wurden gelöscht!");
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
    // Step 1: Tag filtering
    const byTags =
      selectedTags.length === 0
        ? cards
        : cards.filter((card) => {
            if (includeAllTags) {
              // every selected tag must be present on the card
              return selectedTags.every((tag) => card.tags.includes(tag));
            }
            // at least one selected tag matches
            return card.tags.some((tag) => selectedTags.includes(tag));
          });

    // Step 2: Text search across front/back
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byTags;
    return byTags.filter((card) => {
      const inFront = card.front.toLowerCase().includes(q);
      const inBack = card.back.toLowerCase().includes(q);
      return inFront || inBack;
    });
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="absolute mb-4">
        <ModeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">📚 Flashcard Buddy</h1>
          <p className="text-muted-foreground">
            Lerne effektiv mit digitalen Karteikarten
          </p>
        </div>

        {/* Add Card Form */}
        <AddCardForm onAddCard={addCard} />

        {/* Card Count and Info */}
        <div className="mb-6 text-sm text-center">
          {cards.length > 0 && (
            <>
              {/* Etwas wie 🔎 Du hast X Karten dann ob es gibt ein filter (Y mit Filtern angezeigt) */}
              <span>
                Du hast <strong>{cards.length}</strong> Karten
              </span>
              <span className="ml-3">
                {selectedTags.length > 0
                  ? `${selectedTags.length} durch Tags filtert`
                  : "Keine Tags ausgewählt"}
              </span>
            </>
          )}
        </div>
        {/* Search and Tag Filter container */}
        <div className="p-4 my-2 rounded-lg bg-[var(--color-card)] text-[var(--color-card-foreground)] card">
          {/* Search Bar */}
          {cards.length > 0 && (
            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
          )}
          {/* Card Filter*/}
          {cards.length > 0 && getAllTags().length > 0 && (
            <TagFilter
              allTags={getAllTags()}
              tagCounts={getTagCounts()}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              includeAllTags={includeAllTags}
              onIncludeAllChange={setIncludeAllTags}
            />
          )}
        </div>

        {/* Card List or Empty State or there wont be the opportunity for an Empty State
         */}

        {/* Scrollable Card List or Empty State */}
        {/* here i wanna add different tabs thats why i added this scrollable div */}
        <div className="h-[800px] overflow-y-auto pr-3">
          <div className="space-y-4">
            {cards.length === 0 ? (
              <div className="p-8 text-center rounded-lg shadow-md bg-card">
                <p className="mb-4 text-lg text-muted-foreground">
                  🎓 Noch keine Karten vorhanden. Füge deine erste Karte hinzu!
                </p>
              </div>
            ) : getFilteredCards().length === 0 ? (
              <div className="flex justify-center items-center p-8 text-center bg-card rounded-lg shadow-md min-h-[238px]">
                <p className="mb-4 text-lg text-muted-foreground">
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
        </div>

        {/* Delete All Button only if cards.length > 0 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              deleteAllCards();
            }}
            className="px-6 py-3 font-semibold text-white transition-colors rounded-lg cursor-pointer bg-destructive hover:bg-destructive/90"
          >
            🗑️ Alle Karten löschen
          </button>
        </div>
      </div>
    </div>
  );
}
