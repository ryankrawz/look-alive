import { Component, OnInit } from '@angular/core';

import { DeckService } from '../services/deck.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  deckName: string | null = null;
  onMobileDevice: boolean = true;
  browserSupportsOrientation: boolean = true;

  constructor(
    private deckService: DeckService,
  ) { }

  ngOnInit(): void {
    // this.onMobileDevice = screen.width <= 800;
    this.onMobileDevice = true;
    this.browserSupportsOrientation = Boolean(window.DeviceOrientationEvent);
    if (this.onMobileDevice && this.browserSupportsOrientation) {
      this.deckService.loadDeck();
      if (this.deckService.currentDeck) {
        this.deckName = this.deckService.currentDeck.name;
      }
    }
  }

}
