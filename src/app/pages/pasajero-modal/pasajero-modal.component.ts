import { Component, ElementRef, QueryList, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

import { PasajeroViajesService } from 'src/app/services/pasajero-viajes.service';

import { ConductoresService } from 'src/app/services/conductores.service';


@Component({
  selector: 'app-pasajero-modal',
  templateUrl: './pasajero-modal.component.html',
  styleUrls: ['./pasajero-modal.component.scss'],
})
export class PasajeroModalComponent {

  @ViewChild('templateList', {read: ElementRef}) templateListRef: QueryList<ElementRef>;

  /* Filtrador de busqueda */
  searchTerm: string;

  /* Arrays del service */
  conductores = [];
  pasajeros = [];
  viajes = [];

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router,
    private conductorService: ConductoresService,
    private viajeService: PasajeroViajesService
    ) { }


  ionViewWillEnter() {
    this.conductores = this.conductorService.getConductores();
  }

  /* Cerrar el modal */
  dismissModal() {
    this.modalCtrl.dismiss();
  }

  /* Refrescar el contenido del modal */
  doRefresher(event) {
    setTimeout(() => {
      this.conductores.push({
        id: '4',
        name: 'Francisco',
        apellido: 'Juillet',
        cover: 'assets/img/avatar.jpg',
        datos: [
          'Sexo: Masculino',
          ' Edad: 28'
        ],
        rating: 3,
        price: 3000,
        car: 'Seat Arona',
        year: 2021,
        color: 'Azul',
        plate: 'JKL-012',
        seats: 4,
        luggage: 1
      });
      event.target.complete();
    }, 1200);
  }

  /* Agregar viaje */
  async addViaje() {
    const alert = await this.alertCtrl.create({
      header: 'Confirme su viaje',
      inputs: [
        {
          placeholder: 'Dirección',
          name: 'txtDireccion'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.cancelTravel();
          }
        },
        {
          text: 'Confirmar',
          handler: data => {
            /* AGREGAR VIAJE */
            this.viajeService.addViaje(data.txtDireccion);
            this.ionViewWillEnter();
            this.router.navigate(['/interfaz/pasajero-viajes']);
            this.dismissModal();
          }
        }
      ],
    });
    await alert.present();
  }

  /* Alerta despues de cancelar viaje */
  async cancelTravel() {

      const alert = await this.alertCtrl.create({
        header: 'Viaje cancelado',
        message: 'Su petición de viaje ha sido cancelada con exito',
        buttons: [
          {
            text: 'Aceptar',
          },
        ]
      });
      await alert.present();
  }

  /* Alerta despues de confirmar viaje */
  async travelTo() {

    var today = new Date();
    var hour = new Date();
    var conductor = this.conductores[0];
    var now = today.toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' });
    var time = hour.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

      const alert = await this.alertCtrl.create({
        header: 'Datos del viaje',
        message: 'Valor: $' + conductor.valor + '<br> Fecha: ' + now + '<br> Hora del viaje: ' + time,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              this.cancelTravel();
            }
          }, {
            text: 'Aceptar',
            handler: () => {
              /*Metodo para agregar un viaje al historial*/
              this.addViaje();
              this.router.navigate(['./pasajero-viajes']);
              this.ionViewWillEnter();
            }
          }
        ]
      });
      await alert.present();
  }

}


