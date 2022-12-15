import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import jsQR from 'jsqr';
import { element } from 'protractor';

import { UserI, ViajeI } from 'src/app/models/models';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {

  uid: string = null;
  infoViaje: ViajeI = null;
  infoDriver: UserI = null;

  dataAvailable: boolean = false;

  capacity: number;

  rol: 'Conductor' | 'Pasajero';

  scanActive: boolean = false;
  scanResult = null;

  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  loading: HTMLIonLoadingElement;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {

    this.authService.stateUser().subscribe( res => {
      if(res) {
        this.uid = res.uid;

        /* Data conductor */
        this.infoDr(res.uid);
      }
    })
   }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');

    this.getTripsCollection();
  }

  infoDr(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firebaseService.getDoc<UserI>(path, id).subscribe( res => {
      this.infoDriver = res;
      this.rol = res.perfil;
      console.log('info driver', this.infoDriver);
    });
  }

  getTripsCollection() {
    const path = 'Viajes';

    this.firebaseService.getCollection<ViajeI>(path).subscribe( res => {
      res.forEach( doc => {
        if(doc.estado === 'Pendiente')  {
          this.infoViaje = doc;
        }
      });
    });
  }

  decreaseCapacity() {
    const capacidad = {
      capacidad: this.infoViaje.capacidad - 1,
    }

    const path = 'Viajes';
    const id = this.infoViaje.uid;

    if (this.infoViaje.capacidad <= 0) {
      capacidad.capacidad = 0;

      const fullCapacity = this.alertCtrl.create({
        mode: 'ios',
        header: 'Viaje lleno',
        message: 'El viaje ya no tiene capacidad',
        buttons: ['OK']
      });

      fullCapacity.then( res => {
        res.present();
      });

    }

    this.firebaseService.updateDoc(path, id, capacidad);

  }

  passengersPush():boolean {

    if (this.infoViaje.capacidad > 0) {

      this.infoViaje.pasajeros.push({
        uid: this.uid,
        nombre: this.infoDriver.nombre,
        apellido: this.infoDriver.apellido,
        photoURL: this.infoDriver.photoURL,
        email: this.infoDriver.email,
        celular: this.infoDriver.celular
      });

      // Actualizar el viaje
      const path = 'Viajes';
      const id = this.infoViaje.uid;
      const data = this.infoViaje;

      this.firebaseService.updateDoc(path, id, data);
      return true;

    } else {
      return false;
    }
  }

  // Activa la cámara para realizar el escáneo
  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      spinner: 'bubbles',
    });

    await this.loading.present();

    requestAnimationFrame(this.scan.bind(this));
  }

  // Recoge la data al entrar en contacto con el código
  async scan() {

    console.log('Scanning');

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
        inversionAttempts: 'dontInvert',
      }) ;

      if (code) {

        if ( this.passengersPush() === true ) {
          const passAdd = this.alertCtrl.create({
            mode: 'ios',
            header: 'Bien hecho',
            message: 'Te has unido correctamente al viaje',
            buttons: [
              {
                text: 'OK'
            }
            ]
          });

          this.decreaseCapacity();

          passAdd.then( isokay => {
            isokay.present();
          })
        } else {
          const errorPass = this.alertCtrl.create({
            mode: 'ios',
            header: 'Lo sentimos',
            message: 'No existe más capacidad en este viaje.',
            buttons: [
              {
                text: 'OK'
              }
            ]
          });

          errorPass.then( error => {
            error.present();
          });

        }

        this.scanActive = false;
        this.scanResult = code.data;

      } else {

        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }

      }

    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  resetScan() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }

  // Acceder a imágenes
  captureImage() {
    this.fileinput.nativeElement.click();
  }

  // Leer el QR desde la imagen seleccionada
  handleFile(files: FileList) {

    const file = files.item(0);

    var img = new Image();

    img.onload = () => {
      this.canvasContext.drawImage(
        img,
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
          inversionAttempts: 'dontInvert',
        });

        if (code) {

          if ( this.passengersPush() === true ) {
            const passAdd = this.alertCtrl.create({
              mode: 'ios',
              header: 'Bien hecho',
              message: 'Te has unido correctamente al viaje',
              buttons: [
                {
                  text: 'OK'
              }
              ]
            });

            this.decreaseCapacity();

            passAdd.then( isokay => {
              isokay.present();
            })
          } else {
            const errorPass = this.alertCtrl.create({
              mode: 'ios',
              header: 'Lo sentimos',
              message: 'No existe más capacidad en este viaje.',
              buttons: [
                {
                  text: 'OK'
                }
              ]
            });

            errorPass.then( error => {
              error.present();
            });

          }

        } else {

        }

    };

    img.src = URL.createObjectURL(file);

  }

  manualUpdate() {
    this.passengersPush();
    this.decreaseCapacity();
  }

}
