import { Component, OnInit } from '@angular/core';

import { PasajeroViajesService } from 'src/app/services/pasajero-viajes.service';


@Component({
  selector: 'app-interfaz',
  templateUrl: './interfaz.page.html',
  styleUrls: ['./interfaz.page.scss'],
})
export class InterfazPage implements OnInit {

  viajes = [];

  constructor(private viajeService : PasajeroViajesService) { }

  ngOnInit() {
  }

  conductorProfile() {
    console.log('Bienvenido, conductor');
  }

}
