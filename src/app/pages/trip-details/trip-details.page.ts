import { Component, OnInit } from '@angular/core';

import { AlertController, LoadingController } from '@ionic/angular';

import { UserI, ViajeI } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';

import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage implements OnInit {

  uid: string;
  infoUser: UserI = null;

  tripUid: string;
  infoTrip: ViajeI = null;

  passengers = [];

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.authService.stateUser().subscribe( res => {
      if(res) {

        /* Uid del usuario en sesión */
        this.uid = res.uid;
        console.log('Identificacion usuario: ', this.uid);

        /* Información del conductor */
        this.userData(this.uid);
      }
    })
   }

  ngOnInit() {
    this.tripsCollection();
    this.passengersList();
  }

  userData(uid: string) {
    const path = 'Usuarios';
    const id = uid;

    this.firebaseService.getDoc<UserI>(path, id).subscribe( user_cred => {
      if (user_cred) {

        user_cred.uid = this.uid;

        this.infoUser = user_cred;
        console.log('Encargado del viaje: ', this.infoUser);

      }
    });
  }

  tripsCollection() {
    const path = 'Viajes';

    this.firebaseService.getCollection<ViajeI>(path).subscribe( viajes => {

      viajes.forEach( response => {

        if ( response.estado === 'Pendiente' ) {
          this.infoTrip = response;
          console.log('Viaje del encargado', this.infoTrip);
        }
      })

    });
  }

  passengersList() {
    const path = 'Viajes';

    this.firebaseService.getCollection<ViajeI>(path).subscribe( pasajeros => {

      pasajeros.forEach( res => {

        if ( res.estado === 'Pendiente' ) {
          this.passengers = res.pasajeros;
        }

      })
    });
  }

  async loadingTrip() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Comenzando',
      spinner: 'circular',
      duration: 1000
    });

    loading.present();
  }

  async successTrip() {
    const successTrip = await this.alertCtrl.create({
      mode: 'ios',
      message: 'Tú viaje ha comenzando, ¡exito!',
      buttons: [
        {
          text: 'OK',
        }
      ]
    });

    successTrip.present();
  }

  async startTrip() {
    const goingTrip = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Estás cerca de empezar tu viaje',
      message: '¿Deseas comenzar?',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {

            this.loadingTrip();

            setTimeout( async() => {
              await this.successTrip();
              this.changeStatus();
            }, 1500);
          }
        }
      ]
    });
    goingTrip.present();
  }

  changeStatus() {
    const path = 'Viajes';
    const id = this.infoTrip.uid;

    this.firebaseService.updateDoc(path, id, {estado: 'En curso'});
  }

  async loadingFinish() {
    const finishLoading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Finalizando',
      spinner: 'circular',
      duration: 1000
    });

    finishLoading.present();
  }

  async successFinish() {
    const successFinished = await this.alertCtrl.create({
      mode: 'ios',
      message: 'Has finalizado tu viaje, ¡felicidades!',
      buttons: [
        {
          text: 'OK',
        }
      ]
    });

    successFinished.present();
  }

  async finishTrip() {
    const finishTrip = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Viaje por finalizar',
      message: '¿Estás seguro que deseas finalizar el viaje?',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {

            this.loadingFinish();

            setTimeout( async() => {
              await this.successFinish();
              this.finishStatus();
            }, 1500);
          }
        }
      ]
    });
    finishTrip.present();
  }

  finishStatus() {
    const path = 'Viajes';
    const id = this.infoTrip.uid;

    this.firebaseService.updateDoc(path, id, {estado: 'Finalizado'});
  }

}
