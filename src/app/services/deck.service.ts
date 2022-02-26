import { Injectable } from '@angular/core';

import { Deck } from '../interfaces/deck.interface';
import { Status } from '../interfaces/status.interface';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor() { }

  // Loads JSON file holding deck from storage, returns null if deck does not exist
  loadDeck(): Deck | null {
    // TODO
    return {
      name: 'deck',
      cards: [
        'card1',
        'card2',
        'card3',
      ],
    };
  }

  // Writes deck to JSON file for storage
  writeDeck(deck: Deck): Status {
    // TODO
    return {
      code: 200,
      message: 'Success',
    };
  }
}
