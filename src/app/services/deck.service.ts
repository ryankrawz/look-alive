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

  // Getter for card at current position
  getCurrentCard(): string {
    return this.currentDeck ? this.currentDeck.cards[this.currentDeck.position] : '';
  }

  // Loads JSON file holding deck from storage, returns null if deck does not exist
  loadDeck(): void {
    const deckString = localStorage.getItem(this.deckKey);
    this.currentDeck = deckString ? JSON.parse(deckString) : null;
  }

  // Increment position pointer in deck, returns false if no further cards
  nextCard(start: number): boolean {
    console.log('Getting next card');
    console.log(this.currentDeck);
    if (this.currentDeck) {
      this.currentDeck.position = (
        this.currentDeck.position < this.currentDeck.cards.length - 1 ?
        this.currentDeck.position + 1 :
        0
      );
      console.log(`Start: ${start}`);
      console.log(`Current position: ${this.currentDeck.position}`);
      return this.currentDeck.position === start;
    }
    console.log('No deck!');
    return false;
  }

  // Setter for previous score
  setPreviousScore(score: number): void {
    if (this.currentDeck) {
      this.currentDeck.previousScore = score;
    }
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
  writeDeck(deck?: Deck): void {
    if (deck) {
      localStorage.setItem(this.deckKey, JSON.stringify(deck));
      this.currentDeck = deck;
    } else {
      localStorage.setItem(this.deckKey, JSON.stringify(this.currentDeck));
    }
  }
}
