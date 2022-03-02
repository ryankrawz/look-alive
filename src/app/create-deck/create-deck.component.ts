import { Component, OnInit } from '@angular/core';

import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-create-deck',
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.scss']
})
export class CreateDeckComponent implements OnInit {
  card: string = '';
  cards: string[] = [];
  deckName: string = '';
  deckNameEntered: boolean = false;
  roundLength: number = 60;
  roundLengthEntered: boolean = false;

  constructor(
    private deckService: DeckService,
  ) { }

  ngOnInit(): void {
  }

  // Add card to deck
  add(): void {
    this.cards.push(this.card);
    this.card = '';
  }

  // Complete input for stage of deck information
  enter(): void {
    if (this.deckName && !this.deckNameEntered) {
      this.deckNameEntered = true;
    } else if (this.deckName && this.roundLength > 0 && !this.roundLengthEntered) {
      this.roundLengthEntered = true;
    }
  }

  // Complete input for all deck information
  finish(): void {
    this.deckService.writeDeck({
      name: this.deckName,
      cards: this.deckService.shuffle(this.cards),
      position: 0,
      roundLengthSec: this.roundLength,
    });
  }

}
