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

  // Handles changes in gamma rotation
  deviceOrientationHandler(e: DeviceOrientationEvent): void {
    // Correct guess: gamma rotation between 0 and 10 degrees
    const correct = Boolean(e.gamma && e.gamma > 0 && e.gamma < 10);
    // Skip: gamma rotation between 0 and -10 degrees
    const skip = Boolean(e.gamma && e.gamma < 0 && e.gamma > -10);
    if (correct || skip) {
      this.displayResult(correct);
      if (correct) {
        this.score++;
      }
      const nextCard = this.deckService.nextCard(this.startPosition);
      if (!nextCard) {
        this.end();
        this.endReached = true;
      }
      this.currentCard = this.deckService.getCurrentCard();
    }
  }

  // Pauses device orientation listener for 500 ms and indicates a correct guess or skip
  displayResult(correct: boolean): void {
    removeEventListener('deviceorientation', this.deviceOrientationHandler.bind(this));
    this.resultCorrect = correct;
    this.resultSkip = !correct;
    this.sleep(500);
    this.resultCorrect = false;
    this.resultSkip = false;
    addEventListener('deviceorientation', this.deviceOrientationHandler.bind(this));
  }

  // Sets previous score and wristes updated deck
  end(): void {
    removeEventListener('deviceorientation', this.deviceOrientationHandler.bind(this));
    if (this.deckService.currentDeck) {
      this.previousScore = this.score;
      this.deckService.currentDeck.previousScore = this.score;
    }
    this.deckService.writeDeck();
    this.score = 0;
    this.roundStarted = false;
  }

  // Waits for the given amount of ms
  sleep(ms: number): void {
    const baseDate = Date.now();
    let currentDate = Date.now();
    while (currentDate - baseDate < ms) {
      currentDate = Date.now();
    }
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
    while (this.countDown !== 0) {
      this.sleep(1000);
      this.countDown--;
    }
    // Decrement round length to count down seconds
    const roundInterval = setInterval(() => {
      if (this.remainingSec === 0) {
        clearInterval(roundInterval);
        this.end();
      }
      this.remainingSec--;
    }, 1000);
    addEventListener('deviceorientation', this.deviceOrientationHandler.bind(this));
  }
}
