import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-info-vehiculo',
  templateUrl: './info-vehiculo.page.html',
  styleUrls: ['./info-vehiculo.page.scss'],
})
export class InfoVehiculoPage implements OnInit {

  formVehiculo: FormGroup;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private auth: AuthService,
    private database: FirebaseService,
    private builder: FormBuilder,
  ) {
    this.formVehiculo = this.builder.group({
      uid: [''],
      patente: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      capacidad: ['', Validators.compose([Validators.minLength(1), Validators.required])],
      conductorUid: [''],
    });


  }

  ngOnInit() {
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

  createVehicle() {

    const conductorUid = this.auth.getUid();

    this.database.addVehicle(this.formVehiculo.value).then(() => {

      this.savingCar();

      setTimeout(() => {
        this.alertaVehiculoCreado();
        this.router.navigateByUrl('interfaz/conductor');
      }, 2000);


    }).catch(() => {

      console.log('error');

    }).finally(() => {

      console.log('Finalmente');

    });
  }


}


