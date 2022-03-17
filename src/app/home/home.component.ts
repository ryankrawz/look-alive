import { Component, OnInit } from '@angular/core';

import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  deckName: string | null = null;

  constructor(
    private deckService: DeckService,
  ) { }

  ngOnInit(): void {
    this.deckService.loadDeck();
    if (this.deckService.currentDeck) {
      this.deckName = this.deckService.currentDeck.name;
    }
  }

}
