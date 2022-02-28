import { Component, OnInit } from '@angular/core';

import { Deck } from '../interfaces/deck.interface';
import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentDeck: Deck | null = null;

  constructor(
    private deckService: DeckService,
  ) { }

  ngOnInit(): void {
    this.deckService.loadDeck();
    this.currentDeck = this.deckService.getCurrentDeck();
  }

}
