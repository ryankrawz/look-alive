import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.prod';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  signedIn: boolean = false;
  deckCategories: string[] = [];
  currentCategory: string = '';
  decksInCategory: string[] = [];
  currentDeck: string[] = [];

  constructor() { }

  getDeck(deckName: string): void {
    const params = {
      spreadsheetId: atob(environment.SPREADSHEET_ID),
      // Providing only sheet name returns all cells with data
      range: `\'${this.currentCategory}\'`,
      // Retrieve values column-wise since decks occupy columns
      majorDimension: 'COLUMNS',
    };
    gapi.client.sheets.spreadsheets.values.get(params).then((response: any) => {
      if (response.values.length === 0) {
        throw new Error(`The \'${this.currentCategory}\' sheet has no columns (decks)`);
      }
      for (const deck of response.values) {
        if (deck.length > 0) {
          // Top value of column equates to deck name
          if (deck[0] === deckName) {
            // Exclude deck name from play
            deck.shift();
            this.currentDeck = deck;
            return;
          }
        } else {
          throw new Error(`The top row of the \'${this.currentCategory}\' sheet should contain the names of the decks`);
        }
      }
    });
  }

  getDecksInCategory(category: string): void {
    this.currentCategory = category;
    const params = {
      spreadsheetId: atob(environment.SPREADSHEET_ID),
      // Providing only sheet name returns all cells with data
      range: `\'${category}\'`,
    };
    // Sheet values returned row-wise
    gapi.client.sheets.spreadsheets.values.get(params).then((response: any) => {
      if (response.values.length > 0) {
        // First row of sheet contains names of decks
        this.decksInCategory = response.values[0];
      } else {
        throw new Error(`The top row of the \'${category}\' sheet should contain the names of the decks`);
      }
    });
  }

  getDeckCategories(): void {
    const params = {
      spreadsheetId: atob(environment.SPREADSHEET_ID),
      // No need for metadata
      includeGridData: false,
    };
    this.deckCategories = [];
    gapi.client.sheets.spreadsheets.get(params).then((response: any) => {
      response.sheets.forEach((sheet: any) => {
        this.deckCategories.push(sheet.properties.title);
      });
    });
  }

  initClient(): void {
    if (!this.signedIn) {
      // Authenticate with Google API
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: atob(environment.GOOGLE_API_KEY),
          clientId: atob(environment.GOOGLE_CLIENT_ID),
          discoveryDocs: environment.GOOGLE_DISCOVERY_DOCS,
          scope: environment.GOOGLE_READ_ONLY_SCOPE,
        }).then(() => {
          // Listen for sign-in state changes
          gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);
          // Handle initial sign-ins
          this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
      });
    } else {
      throw new Error('Attempted authentication with Google API when already signed in');
    }
  }

  private updateSignInStatus(signInStatus: boolean): void {
    this.signedIn = signInStatus;
  }
}
