// FlashcardKamerad? working title
'use client';

const STORAGE_KEY = "flashcard_buddy_cards";
export default function FlashcardBuddy() {

const [cards, setCards] = useState<Card[]>([]); 


// 2 test cards
// TODO! delete these later
useEffect(() => {
  const testCard: Card = {
    id: 1,
    front: "Was ist die Hauptstadt der USA?",
    back: "Langley Falls, Virginia",
    showAnswer: false,
  };


  const testCard2: Card = {
    id: 2,
    front: "Was ist die Hauptstadt von Frankreich?",
    back: "Frankfurt",
    showAnswer: false,
  };

  setCards([testCard, testCard2]);
}, []);




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
        {/* <TagFilter> || <SearchBar /> */}



        {/* Card List or Empty State 
        */}

        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-gray-600 mb-4">
                🎓 Noch keine Karten vorhanden. Füge deine erste Karte hinzu!
              </p>
            </div>
            {/* cardlist.length <= 0 show this */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-gray-600 mb-4">
                🔍 Keine Karten mit diesen Tags gefunden.
              </p>
            </div>
        </div>

        {/* Delete All Button only if cards.length > 0 */}
          <div className="text-center mt-8">
            <button
              // onClick={deleteAllCards}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              🗑️ Alle Karten löschen
            </button>
          </div>
      </div>
    </div>
  );
}
