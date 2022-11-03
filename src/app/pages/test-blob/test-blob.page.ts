import { Component } from '@angular/core';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-test-blob',
  templateUrl: './test-blob.page.html',
  styleUrls: ['./test-blob.page.scss'],
})

export class TestBlobPage {
  user = null;

  constructor(
    private platform: Platform
  ) {
    this.initializeApp();

    this.platform.ready().then(() => {
      GoogleAuth.initialize();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      GoogleAuth.initialize();
    });
  }

  async signIn() {
    this.user =  await GoogleAuth.signIn();
    console.log('user:', this.user);
  }

  async refresh() {
    const authCode = await GoogleAuth.refresh();
    console.log('refresh: ', authCode);
  }

  async signOut() {
    await GoogleAuth.signOut();
    this.user = null;
  }

}
