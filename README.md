# 📚 Flashcard Buddy

A flashcard application built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS** and **shadcn**. By Andi Lilaj for the Javascript course at HsH

My codetime badge:

[![CodeTime Badge](https://shields.jannchie.com/endpoint?style=for-the-badge&color=222&url=https%3A%2F%2Fapi.codetime.dev%2Fv3%2Fusers%2Fshield%3Fuid%3D34950)](https://codetime.dev)

Vercel Deployment:

https://andi-lilaj-flashcard-buddy.vercel.app/

## Features

### Core Functionality

- **Add Flashcards** - Create cards with questions and answers
- **Show/Hide Answers** - Toggle between front and back with smooth animations
- **Delete Cards** - Remove individual cards with confirmation dialogs
- **Local Storage** - Automatic persistence of all flashcards
- **Search & Filter** - Find cards quickly by content or tags
- **Tag System** - Organize cards with custom tags

### Screenshot

![Screenshot_22-10-2025_1810_localhost](https://github.com/user-attachments/assets/f569adee-8cc6-4187-8a20-66f10107764c)


## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```powershell
# Clone the repository
git clone https://github.com/lilazero/andi-lilaj-flashcard-Buddy

# Navigate to project directory
cd next-flashcards-next-andi-lilaj

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server with Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```text
└── 📁src
    └── 📁app
        ├── favicon.ico         >comes with NextJS
        ├── globals.css		    >shadcn theme
        ├── layout.tsx		    >Rootlayout with metadata
        ├── page.tsx		    >Main Start Page. It was FlashCardBuddy.tsx as the only component and it goes downhill from there.
        └── 📁components
        └── 📁ui
            ├── button.tsx	    >shadcn now i remember i never used it 🤦‍♂️
            ├── sonner.tsx	    >shadcn toast notification component
        ├── AddCardForm.tsx	    >Card Creation Form
        ├── CardComponent.tsx   >Contains the Front(question), Back(Answer), and buttons in the card
        ├── EditCardForm.tsx	>Copy of AddCardForm but edit's the Card where the Edit button was clicked
        ├── FlashcardBuddy.tsx  >This is where the Magic happens, It's the Main component that brings everything together
				                ^And holds the main inter-component state management like the displayed Card array
				                ^the selected Tags to be shown from TagFilter or the Search on querychange setSearchQuery
        ├── SearchBar.tsx	    >A search bar that also searches tags
        ├── TagFilter.tsx	    >Shows filters, select filters, selected filters restrict the card list to the filters
				                ^the tag toggle works by showing only cards where all the tags are present otherwise it's any of the tags
    └── 📁lib
        └── utils.ts		>shadcn helper
```

## 📌Learning Objectives (Was du zeigen sollst. (Lernziele))

This project demonstrates:

1. Variablen, Funktionen, Debugging: 	Klare Funktionen, console.log zum Testen (und toast notifications auch) ✅➕
2. Conditionals, Input-Validierung:		Prüfen ob Eingaben leer sind ✅
3. Loops, Arrays durchlaufen:			Karten mit forEach anzeigen (ist .map ok?) ➕
4. Arrays, Objekte, Immutabilität:		Karten-Objekte, .filter() zum Löschen✅
5. DOM-Manipulation, Events:			Karten erstellen/anzeigen, Button-Clicks (mit setTimeout auch ✅) ✅➕
6. localStorage:						Karten speichern und laden ✅
7. Basic Setup:						Vite-Projekt aufsetzen (optional), (Ich habe NextJS) ✅➕

## 📌Bewertung Richtliniens

| Kategorie                          | Punkte | Your Rating | How it happens                                                                                                                                            |
| ---------------------------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Funktionalität                    | 45     |             | FB =FlashcardBuddy, CC= CardComponent, ACF= AddCardForm                                                                                                   |
| - Karten hinzufügen               | 11     |             | ACF.tsx onAddCard calls FlashcardBuddy.tsx addCard {}                                                                                                     |
| - Karten anzeigen                  | 11     |             | FlashcardBuddy.tsx CardComponent under the getFilteredCards.map                                                                                           |
| - Antwort zeigen/verstecken        | 12     |             | CardComponent onToggleAnswer > FB toggleAnswer function (1st function)                                                                                    |
| - Karten löschen                  | 11     |             | CC onDelete(id) > FB deleteCard (id)                                                                                                                      |
| localStorage                       | 20     |             |                                                                                                                                                           |
| - Speichern funktioniert           | 11     |             | Yep, through a useEffect and also has a isInitialLoad check to not save as soon as the component mounts but that's how far optimization goes              |
| - Laden beim Start                 | 9      |             | through a function that gets called on component mount like saving                                                                                        |
| Code-Qualität                     | 12     |             | By the below conditions. Yea.                                                                                                                             |
| - Funktionen haben klare Namen     | 6      |             | Yes. and also verbosely commented everything                                                                                                              |
| - DRY-Prinzip (keine Duplikate)    | 6      |             | Yes. Yes.                                                                                                                                                 |
| Input-Validierung                  | 13     |             | Also input sanitization, tags are undercased and input is trimmed of whitespaced                                                                         |
| - Leere Eingaben werden abgefangen | 13     |             | with a nice error toaster popup on the bottom right                                                                                                       |
| UI/UX                              | 10     |             |                                                                                                                                                           |
| -Leerer Zustand sichtbar           | 5      |             | Yes. Also when the filter combination and or search query finds nothing                                                                                   |
| -Feedback bei Aktionen             | 5      |             | Popup toasts on the bottom right also confirmation button when the delete button is clicked.                                                              |
| BONUS                              | +15    |             |                                                                                                                                                           |
| -Karten-Suche/Filter               | +5     |             | Both.                                                                                                                                                     |
| -Kategorien                        | +5     |             | Ich habe Tags als Begriff verwended weil ein Tag ist many to many. Während Kategorie ist. Und ich wollte die Möglichkeit geben, viele Tags auszuwählen |
| -Karten Bearbaiten                 | +5     |             | An AddCardForm copy that takes an id and overwrittes that id                                                                                              |
| -"Alle löschen" Button            | +3     |             |                                                                                                                                                           |

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **React:** Version 19.1.0
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Build Tool:** Turbopack

## Data Model

Flashcards are stored as objects with the following structure:

```typescript
interface Card {
  id: number;              // Unique identifier (timestamp-based)
  front: string;           // Question/Front side
  back: string;            // Answer/Back side
  tags: string[];          // Array of tag strings
  showAnswer: boolean;     // UI state for answer visibility
}
```

## Key Concepts

### State Management

```typescript
const [cards, setCards] = useState<Card[]>([]);
const [loadingCardId, setLoadingCardId] = useState<number | null>(null);
```

### Immutable Updates

```typescript
// Add card
setCards([...cards, newCard]);

// Delete card
setCards(cards.filter(card => card.id !== id));

// Toggle answer
setCards(cards.map(card => 
  card.id === id ? { ...card, showAnswer: !card.showAnswer } : card
));
```

### Local Storage Persistence

```typescript
// Save
localStorage.setItem('flashcard_buddy_cards', JSON.stringify(cards));

// Load
const stored = localStorage.getItem('flashcard_buddy_cards');
if (stored) setCards(JSON.parse(stored));
```

## Available Scripts

```bash
pnpm dev      # Start development server with Turbopack
pnpm lint     # Run ESLint
```

## Contributing

This is an educational project. Feel free to fork and experiment!

## 📄 License

MIT. Just a "courtesy of Andi Lilaj" suffices
