import { Component, OnDestroy, OnInit } from '@angular/core';

import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy, OnInit {
  private score: number = 0;
  private startPosition: number = 0;
  private timeoutId: number | null = null;
  countDown: number = 0;
  currentCard: string = '';
  deckName: string = '';
  endReached: boolean = false;
  previousScore: number | null = null;
  roundStarted: boolean = false;
  remainingSec: number = 60;
  resultCorrect: boolean = false;
  resultSkip: boolean = false;

  constructor(
    private deckService: DeckService,
  ) {
    // Listen for browser unload to exit gracefully
    addEventListener('beforeunload', this.ngOnDestroy.bind(this));
  }

  ngOnInit(): void {
    this.deckService.loadDeck();
    if (this.deckService.currentDeck) {
      this.deckName = this.deckService.currentDeck.name;
      this.previousScore = this.deckService.currentDeck.previousScore !== undefined ? this.deckService.currentDeck.previousScore : null;
      this.startPosition = this.deckService.currentDeck.position;
      this.currentCard = this.deckService.getCurrentCard();
    }
  }

  ngOnDestroy(): void {
    if (this.roundStarted) {
      this.end(true);
    }
    removeEventListener('beforeunload', this.ngOnDestroy.bind(this));
  }

  // Handles event for button being held
  downHandler(correct: boolean): void {
    // Trigger answering mechanism if held more than 500ms
    this.timeoutId = window.setTimeout(() => {
      this.resultCorrect = correct;
      this.resultSkip = !correct;
      // Display result for 2 sec
      window.setTimeout(() => {
        this.resultCorrect = false;
        this.resultSkip = false;
        if (correct) {
          this.score++;
        }
        const nextCard = this.deckService.nextCard(this.startPosition);
        if (!nextCard) {
          this.end(nextCard);
          this.endReached = true;
        }
        this.currentCard = this.deckService.getCurrentCard();
      }, 2000);
    }, 500);
  }

  // Sets previous score and writes updated deck
  private end(nextCard: boolean): void {
    if (this.deckService.currentDeck) {
      this.previousScore = this.score;
      this.deckService.currentDeck.previousScore = this.score;
    }
    // Iterate card so next round starts with new card
    if (nextCard) {
      this.endReached = !this.deckService.nextCard(this.startPosition);
      this.currentCard = this.deckService.getCurrentCard();
    }
    this.deckService.writeDeck();
    this.score = 0;
    this.roundStarted = false;
  }

  // Begins round countdown and shows current card in deck
  start(): void {
    this.roundStarted = true;
    if (this.deckService.currentDeck) {
      // Default round length is 60 sec
      this.remainingSec = this.deckService.currentDeck.roundLengthSec;
    }
    // 3 second period for player to prepare
    this.countDown = 3;
    const countDownInterval = setInterval(() => {
      if (this.countDown === 0) {
        clearInterval(countDownInterval);
      } else {
        this.countDown--;
      }
    }, 1000);
    // Decrement round length to count down seconds
    const roundInterval = setInterval(() => {
      if (this.remainingSec === 0) {
        clearInterval(roundInterval);
        if (this.roundStarted) {
          this.end(true);
        }
      // Only decrement round countdown if initial countdown is completed and no result is displayed
      } else if (this.countDown === 0 && !(this.resultCorrect || this.resultSkip)) {
        this.remainingSec--;
      }
    }, 1000);
  }

  // Handles event for button being released
  upHandler(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
