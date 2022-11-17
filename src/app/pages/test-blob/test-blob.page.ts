import { Component, ElementRef, ViewChild } from '@angular/core';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

import { LoadingController, Platform, ToastController } from '@ionic/angular';

import jsQR from 'jsqr';

@Component({
  selector: 'app-test-blob',
  templateUrl: './test-blob.page.html',
  styleUrls: ['./test-blob.page.scss'],
})

export class TestBlobPage {
  user = null;

  scanActive = false;
  scanResult = null;

  @ViewChild('video', { static: false }) video : ElementRef;
  @ViewChild('canvas', { static: false }) canvas : ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput : ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  loading: HTMLIonLoadingElement;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {
    const isInStandaloneMode = () =>
    'standalone' in window.navigator && window.navigator['standalone'];

    if (this.platform.is('ios') && isInStandaloneMode()) {
      console.log('I am an iOS PWA!');
    }

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

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
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

  captureImage() {
    this.fileInput.nativeElement.click();
  }

  handleFile(files: FileList) {

    const file = files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.scanResult = code.data;
        this.presentToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }

  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {

    console.log('SCAN');

    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {

      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      console.log('code:', code);

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.presentToast();
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }

    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  //Helper functions
  stopScan() {
    this.scanActive = false;
  }

  reset() {
    this.scanResult = null;
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
    toast.present();
  }

}
