// FlashcardKamerad? working title
'use client';

import AddCardForm from "./AddCardForm";
import { Card, CardComponent } from "./CardComponent";
import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = "flashcard_buddy_cards";


export default function FlashcardBuddy() {

const [cards, setCards] = useState<Card[]>([]); 


  const toggleAnswer = (id: string): void => {
    console.log(`[toggleAnswer] Attempt to fetch card with id: ${id}...`);
    
    // TODO: add a setTimeout(() => {}) to simulate loading time
    
      setCards(
        cards.map(card =>
          card.id === id
            ? { ...card, showAnswer: !card.showAnswer }
            : card
        )
      );
      
  };

const addCard = (front: string, back: string): void => {
    const newCard: Card = {
      //random uuid but it's nextjs client side ? can it be susceptible to attacks?
      id: crypto.randomUUID(),
      front,
      back,
      showAnswer: false,
      // TODO: implement tags later
    };
    setCards([...cards, newCard]);
  }

  //* localStorage is available in any client-side context, but not during server-side rendering (SSR), since it's a browser API.
  //* Which means to integrate XATA or some other database i have to burn this all to the ground and start over.
  //* also load then save otherwise it saves an empty array over the one that's supposed to be loaded than it loads the empty one

  /*  Load cards from localStorage on component mount */
  const loadFromStorage = (): void => {
  try {
    const storedCards = localStorage.getItem(STORAGE_KEY);
    if (storedCards) {
      const parsedCards = JSON.parse(storedCards) as Card[];
      console.log(`[loadFromStorage] Loaded ${parsedCards.length} cards from localStorage.`);
      setCards(parsedCards);
    } else {
      console.log("[loadFromStorage] No cards found in localStorage.");
    }
  } catch (error) {
    console.error("[loadFromStorage] Error loading cards from localStorage:", error);
    setCards([]); // Reset to empty array on error // TODO!: Change when implementing database
  } finally {
    console.log("[loadFromStorage] Load attempt finished.");
  }

};

useEffect(() => {
  loadFromStorage();
  console.log("[FlashcardBuddy] loadFromStorage called on component mount...");
}, []);


/* //* Save to Storage function */

  const saveToStorage = (cardsToSave: Card[]):void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsToSave)); 
      console.log(`[saveToStorage] ${cardsToSave.length} Cards saved to localStorage.`);
      // * For detailed logging in development, uncomment the following:
      // *if (process.env.NODE_ENV === "development") {
      //  * console.log(`[saveToStorage] Card IDs: ${cardsToSave.map(card => card.id).join(", ")}`);
    } catch (err) {
      console.error("[saveToStorage] Error saving cards to localStorage:", err);
    } finally {
      console.log("[saveToStorage] Save attempt finished.");
    }
  }

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


  const updateCard = (id: string, front: string, back: string, ): void => {
    setCards(cards.map(card => card.id === id ? { ...card, front, back} : card));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Flashcard Buddy
          </h1>
          <p className="text-gray-600">
            Lerne effektiv mit digitalen Karteikarten
          </p>
        </div>

        {/* Add Card Form */}
        <AddCardForm onAddCard={addCard} />

        {/* Card Count and Info */}
        <div className="text-center mb-6 text-sm text-gray-600">
          {cards.length >0 &&(

            <>
              {/* Etwas wie 🔎 Du hast X Karten dann ob es gibt ein filter (Y mit Filtern angezeigt) */}
              <span>
                Du hast <strong>{cards.length}</strong> Karten
              </span>
                <span className="ml-3">
                  {/* (Y shown wegen Filtern) */}
                </span>
            </>
        )}
        </div>

        {/* Tag Filter , nur anzeigen wenn es karten gibt, oder auch ein search dass durch alles sucht, 
        */}
        {/* <TagFilter> und oder <SearchBar /> */}



        {/* Card List or Empty State or there wont be the opportunity for an Empty State
        */}

        <div className="space-y-4">
          {/* Empty State */}
          {/* The condition 'cards.length <= 0' which should be filter.length? is redundant since it's
          already inside an else block where 'cards.length === 0' is false. 
          This condition will never be true and creates unreachable code. 
          BUT I will leave it in case some reset filter logic or something else
          doesn't work. 
          Better safe than sorry. -someone who's been sorry a lot of times
          */}
          {cards.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-gray-600 mb-4">
                🎓 Noch keine Karten vorhanden. Füge deine erste Karte hinzu!
              </p>
            </div>
          ) :
          /*Vielleicht werde ich das nicht verwenden, weil ich das Tag über ein Dropdown-Menü auswählen kann  */
          ( cards.length <= 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-lg text-gray-600 mb-4">
                  🔍 Keine Karten mit diesen Tags gefunden.
                </p>
              </div>
            ) : (
            cards.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                onToggleAnswer={toggleAnswer}
                onEdit={updateCard}
              />
            ))
          ))}
        </div>

        {/* Delete All Button only if cards.length > 0 */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                if (cards.length > 0) {
                  if (confirm("Möchten Sie wirklich alle Karten löschen?")) {
                    setCards([]);
                  }
                }
                else {
                  alert("Es gibt keine Karten zum Löschen vorhanden.");
                }
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              🗑️ Alle Karten löschen
            </button>
          </div>
      </div>
    </div>
  );
}
