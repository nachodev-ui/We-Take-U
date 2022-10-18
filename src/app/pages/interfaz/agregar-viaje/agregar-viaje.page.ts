import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PasajeroViajesService } from 'src/app/services/pasajero-viajes.service';



@Component({
  selector: 'app-agregar-viaje',
  templateUrl: './agregar-viaje.page.html',
  styleUrls: ['./agregar-viaje.page.scss'],
})
export class AgregarViajePage implements OnInit {

  constructor(private router: Router,
              private viajeService: PasajeroViajesService) { }

  ngOnInit() {
  }

  guardarViaje(txtDireccion) {
    this.viajeService.addViaje(txtDireccion.value);
    this.router.navigate(['/home/pasajero-viajes']);
  }

}


