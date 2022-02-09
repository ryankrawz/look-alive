import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.prod';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  signedIn: boolean = false;

  constructor() { }

  initClient(): void {
    if (!this.signedIn) {
      // Authenticate with Google API
      gapi.client.init({
        apiKey: atob(environment.GOOGLE_API_KEY),
        clientId: atob(environment.GOOGLE_CLIENT_ID),
        discoveryDocs: environment.GOOGLE_DISCOVERY_DOCS,
        scope: environment.GOOGLE_READ_ONLY_SCOPE,
      }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);
        // Handle initial sign-in
        this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    } else {
      throw new Error('Attempted authentication with Google API when already signed in');
    }
  }

  private updateSignInStatus(signInStatus: boolean): void {
    this.signedIn = signInStatus;
  }
}
