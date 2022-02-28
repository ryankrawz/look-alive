import { Injectable } from '@angular/core';

import { Deck } from '../interfaces/deck.interface';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  currentDeck: Deck | null = null;
  deckKey: string = 'look.alive.current.deck';

  constructor() { }

  // Removes JSON file holding deck from storage
  deleteDeck(): void {
    localStorage.removeItem(this.deckKey);
  }

  // Getter for current loaded deck
  getCurrentDeck(): Deck | null {
    return this.currentDeck;
  }

  // Loads JSON file holding deck from storage, returns null if deck does not exist
  loadDeck(): void {
    const deckString = localStorage.getItem(this.deckKey);
    this.currentDeck = deckString ? JSON.parse(deckString) : null;
  }

  // Shuffles cards in deck
  shuffle(cards: string[]): string[] {
    let currentIndex = cards.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
    }
    return cards;
  }

  // Writes deck to JSON file for storage
  writeDeck(deck: Deck): void {
    localStorage.setItem(this.deckKey, JSON.stringify(deck));
  }
}
