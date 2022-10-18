import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { UserI, ViajeI } from 'src/app/models/models';
import { ApiService } from 'src/app/services/api.service';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-c-modal',
  templateUrl: './c-modal.page.html',
  styleUrls: ['./c-modal.page.scss'],
})
export class CModalPage implements OnInit {

  uid: string = null;

  viaje: ViajeI;

  infoUser: UserI = null;
  infoUser1: UserI = null;
  infoUser2: UserI = null;
  infoUser3: UserI = null;
  infoUser4: UserI = null;

  sedes: any = [
    {

    }
  ];

  constructor(
    private modalCtrl: ModalController,
    private authFire: AuthService,
    private dataFire: FirebaseService,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.getCollectionPasajeros();
    this.loadApi();
  }

  async FormViaje() {

  }

  async takeTravel() {
    const id = this.uid;

    this.viaje = await this.dataFire.getDoc<ViajeI>('Usuarios', id).toPromise();
    this.viaje.estado = 'Viajando';
    this.dataFire.updateDoc('Usuarios', this.uid, this.infoUser);
    this.router.navigate(['googlemaps']);
    this.modalCtrl.dismiss();
  }

  getCollectionPasajeros() {
    const query = this.dataFire.getCollection<UserI>('Usuarios');
    query.subscribe(res => {

      const firstPasajero = res[0];
      const secondPasajero = res[1];
      const thirdPasajero = res[2];
      const fourthPasajero = res[3];

      this.infoUser1 = firstPasajero;
      this.infoUser2 = secondPasajero;
      this.infoUser3 = thirdPasajero;
      this.infoUser4 = fourthPasajero;
    });

  }

  loadApi() {
    this.api.getSedes().subscribe(
      (res) => {
        this.sedes = res;
        console.log(this.sedes);

      },
      (err) => {
        console.log(err);
      }
    )

  }

}

