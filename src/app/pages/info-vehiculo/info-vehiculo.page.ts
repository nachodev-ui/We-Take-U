import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';
import { UserI } from 'src/app/models/models';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-info-vehiculo',
  templateUrl: './info-vehiculo.page.html',
  styleUrls: ['./info-vehiculo.page.scss'],
})
export class InfoVehiculoPage implements OnInit {

  formVehiculo: FormGroup;

  uid : string = null;

  infoUser : UserI = null;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private auth: AuthService,
    private database: FirebaseService,
    private builder: FormBuilder,
  ) {
    this.formVehiculo = this.builder.group({
      patente: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      capacidad: ['', Validators.compose([Validators.minLength(1), Validators.required])],
    });

    this.auth.stateUser().subscribe(res => {
      if (res) {
        this.uid = res.uid;
        this.getInfoUser();
      }
    });

  }

  ngOnInit() {
  }

  /*Tomar los datos del usuario autenticado*/
  getInfoUser() {
    const path = 'Usuarios';
    const id = this.uid;

    this.database.getDoc<UserI>(path, id).subscribe( credentials => {
      if (credentials) {
        this.infoUser = credentials;
      }
    });

  }

  //Add data to vehiculo array in UserI
  addVehiculo() {
    this.auth.stateUser().subscribe(res => {
      if (res) {
        this.database.updateVehicleFromUserI(this.formVehiculo.value).then( res => {
          this.alertaVehiculoCreado();
        });
      }
    });
  }

  async alertaPatenteExiste() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: '¿Te has equivocado?',
      message: 'La patente que intentas ingresar ya existe',
      buttons: ['OK']
    });

    await alert.present();
  }

  async savingCar() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Guardando vehículo',
      duration: 1000
    });
    await loading.present();
  }

  async alertaVehiculoCreado() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: '¡Vehículo guardado!',
      message: 'Tu vehículo ha sido registrado correctamente',
      buttons: ['OK']
    });

    await alert.present();
  }

}


