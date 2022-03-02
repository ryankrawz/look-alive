import { Component, OnDestroy, OnInit } from '@angular/core';

import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy, OnInit {
  currentCard: string = '';
  deckName: string = '';
  previousScore: number | null = null;
  roundStarted: boolean = false;
  // Default round length is 60 seconds
  remainingSec: number = 60;
  score: number = 0;
  startPosition: number = 0;

  constructor(
    private deckService: DeckService,
  ) {
    // Listen for browser unload to exit gracefully
    addEventListener('beforeunload', this.ngOnDestroy.bind(this));
  }

  ngOnInit(): void {
    if (this.deckService.currentDeck) {
      this.deckName = this.deckService.currentDeck.name;
      this.previousScore = this.deckService.currentDeck.previousScore !== undefined ? this.deckService.currentDeck.previousScore : null;
      this.startPosition = this.deckService.currentDeck.position;
      this.currentCard = this.deckService.getCurrentCard();
    }
  }

  ngOnDestroy(): void {
    if (this.roundStarted) {
      this.end();
    }
    removeEventListener('beforeunload', this.ngOnDestroy.bind(this));
  }

  // Handles changes in gamma rotation
  deviceOrientationHandler(e: DeviceOrientationEvent): void {
    // TODO: handle changes in gamma rotation
    if ('user cashed or skipped') {
      if ('user cashed') {
        this.score++;
      }
      const nextCard = this.deckService.nextCard(this.startPosition);
      if (!nextCard) {
        this.end();
        // TODO: handle end of deck being reached
      }
      this.currentCard = this.deckService.getCurrentCard();
    }
  }

  // Sets previous score and wristes updated deck
  end(): void {
    removeEventListener('deviceorientation', this.deviceOrientationHandler);
    if (this.deckService.currentDeck) {
      this.previousScore = this.score;
      this.deckService.currentDeck.previousScore = this.score;
    }
    this.deckService.writeDeck();
    this.score = 0;
    this.roundStarted = false;
  }

  // Begins round countdown and shows current card in deck
  start(): void {
    this.roundStarted = true;
    if (this.deckService.currentDeck) {
      this.remainingSec = this.deckService.currentDeck.roundLengthSec;
    }
    // Decrement round length to count down seconds
    const roundInterval = setInterval(() => {
      if (this.remainingSec === 0) {
        clearInterval(roundInterval);
        this.end();
      }
      this.remainingSec--;
    }, 1000);
    addEventListener('deviceorientation', this.deviceOrientationHandler);
  }
}
