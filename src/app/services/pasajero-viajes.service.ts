import { Injectable } from '@angular/core';

import { ConductoresService } from './conductores.service';

import { Viaje } from '../pages/interfaz/pasajero-viajes/viaje';


@Injectable({
  providedIn: 'root'
})
export class PasajeroViajesService {

  private viajes : Viaje[] = [
    {
      id: '1',
      estado: 'Finalizado',
      valor: '3.590',
      direccion: 'Calle 1 # 2 - 3',
      hora: '10:00',
      conductorName: this.conductorService.getConductor('1').name,
      conductorApellido: this.conductorService.getConductor('1').apellido,
      coverConductor: this.conductorService.getConductor('1').cover
    }
  ]

  constructor(private conductorService: ConductoresService) { }

  getViajes() {
    return [...this.viajes];
  }

  getViaje(id: string) {
    return {
      ...this.viajes.find(viaje => viaje.id === id)
    };
  }

  addViaje(direccion: string) {
    this.viajes.push({
      id: this.viajes.length + 1 + '',
      direccion,
      estado: 'Activo',
      hora: '10:00',
      valor: this.conductorService.getConductor('2').valor,
      conductorName: this.conductorService.getConductor('2').name,
      conductorApellido: this.conductorService.getConductor('2').apellido,
      coverConductor: this.conductorService.getConductor('2').cover
    });
  }


  deleteViaje(id: string) {
    this.viajes = this.viajes.filter(viaje => {
      return viaje.id !== id;
    });
  }
}
