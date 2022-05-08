import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-create-deck',
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.scss']
})
export class CreateDeckComponent implements OnInit {
  private cardInput: HTMLElement | null = null;
  card: string = '';
  cards: string[] = [];
  deckName: string = '';
  deckNameEntered: boolean = false;
  repeatCard: boolean = false;
  roundLength: number = 60;
  roundLengthEntered: boolean = false;

  constructor(
    private deckService: DeckService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  // Add card to deck
  add(): void {
    // Avoid repeat cards, ignore capitalization
    this.repeatCard = this.cards.some((card: string) => card.toLowerCase() === this.card.toLowerCase());
    if (!this.repeatCard) {
      this.cards.push(this.card);
      this.card = '';
    }
    // Automatically refocus on input field
    if (this.cardInput === null) {
      this.cardInput = document.getElementById('card');
    }
    this.cardInput?.focus();
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
    this.router.navigateByUrl('/play');
  }

}
