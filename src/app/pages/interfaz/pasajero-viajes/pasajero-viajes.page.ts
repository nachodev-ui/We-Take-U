import { Component, OnInit } from '@angular/core';

import { PasajeroViajesService } from 'src/app/services/pasajero-viajes.service';


@Component({
  selector: 'app-pasajero-viajes',
  templateUrl: './pasajero-viajes.page.html',
  styleUrls: ['./pasajero-viajes.page.scss'],
})
export class PasajeroViajesPage implements OnInit {

  viajes = [];

  /* Obtener hora en tiempo local a traves de un metodo */
  hours = this.getHours();

  constructor(
    private viajeService: PasajeroViajesService
    ) { }

  ngOnInit() {
    this.viajes = this.viajeService.getViajes();
  }

  ionViewWillEnter() {
    this.viajes = this.viajeService.getViajes();
  }

  getHours() {
    var hour = new Date();

    var time = hour.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    return time + 'hrs';
  }

}
