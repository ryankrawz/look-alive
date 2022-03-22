import { Component, OnDestroy, OnInit } from '@angular/core';

import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy, OnInit {
  countDown: number = 0;
  currentCard: string = '';
  deckName: string = '';
  endReached: boolean = false;
  previousScore: number | null = null;
  roundStarted: boolean = false;
  remainingSec: number = 60;
  resultCorrect: boolean = false;
  resultSkip: boolean = false;
  score: number = 0;
  startPosition: number = 0;

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
      this.end();
    }
    removeEventListener('beforeunload', this.ngOnDestroy.bind(this));
  }

  // Handles event for button being double clicked
  doubleClickHandler(correct: boolean): void {
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
        this.end();
        this.endReached = true;
      }
      this.currentCard = this.deckService.getCurrentCard();
    }, 2000);
  }

  // Sets previous score and wristes updated deck
  end(): void {
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
        this.end();
      // Only decrement round countdown if initial countdown is completed
      } else if (this.countDown === 0) {
        this.remainingSec--;
      }
    }, 1000);
  }
}
