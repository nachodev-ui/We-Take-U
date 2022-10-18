import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { PasajeroViajesService } from 'src/app/services/pasajero-viajes.service';
import { Viaje } from '../viaje';


@Component({
  selector: 'app-viaje-activo',
  templateUrl: './viaje-activo.page.html',
  styleUrls: ['./viaje-activo.page.scss'],
})
export class ViajeActivoPage implements OnInit {

  viaje : Viaje;
  viajes = [];

  hours = this.getHours();

  constructor(private actRoute : ActivatedRoute,
              private router : Router,
              private viajeService : PasajeroViajesService,
              private alertCtrl : AlertController,
              private loadingCtrl : LoadingController) {}

  ngOnInit() {
    /* Crear el paramMap para el id */
    this.actRoute.paramMap.subscribe
    (paramMap => {
      this.viaje = this.viajeService.getViaje(paramMap.get('id'));
    });
  }

  getHours() {
    var hour = new Date();

    var time = hour.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    return time + 'hrs';
  }

  async refLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando historial',
      duration: 2000,
      spinner: 'lines-sharp-small',
      mode: 'ios'
    });
    await loading.present();

  }

  async cancelAccept() {

    const alert = await this.alertCtrl.create({
      header: 'Viaje cancelado',
      message: 'Su viaje ha sido cancelado',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            /* Con el paramMap seleccionado borraremos los viajes  */
            this.viajeService.deleteViaje(this.viaje.id);
            this.refLoading();
            this.router.navigate(['../pasajero-viajes']);
          }
        }
      ]
    });
    await alert.present();
}

  async cancelLive() {

    const alert = await this.alertCtrl.create({
      header: 'Cancelar viaje',
      message: '¿Está seguro que desea cancelar el viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: () => {
            /* Viaje eliminado  */
            this.cancelAccept();
            /*  */
          }
        }
      ]
    });

    await alert.present();
  }

  async liveCancelTravel() {

    var today = new Date();
    var hour = new Date();
    var now = today.toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var time = hour.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

      const alert = await this.alertCtrl.create({
        header: 'Datos del viaje',
        message: 'Fecha: ' + now + '<br> Hora del viaje: ' + time,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          }, {
            text: 'Aceptar',
            handler: () => {
              /* Eliminar el viaje  */
              this.cancelLive();
            }
          }
        ]
      });
      await alert.present();
  }

}
