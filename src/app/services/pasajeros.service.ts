import { Injectable } from '@angular/core';

import { Pasajero } from '../pages/interfaz/pasajero/pasajero';

@Injectable({
  providedIn: 'root'
})
export class PasajerosService {

  private pasajeros : Pasajero[] = [
    {
      id: '1',
      nombre: 'Ignacio',
      apellido: 'Cisternas',
      edad: '20',
      sexo: 'Masculino',
      imagen: 'assets/img/ruby_icon.jpg',
      direccion: 'Calle 1 # 2 - 3'
    }
  ];

  constructor() { }

  getPasajeros() {
    return [...this.pasajeros];
  }

  getPasajero(id: string) {
    return {
      ...this.pasajeros.find(pasajero => {
        return pasajero.id === id;
      })
    };
  }

  addPasajero(nombre: string, apellido: string, edad: string, sexo: string, imagen: string, direccion: string) {
    this.pasajeros.push({
      id: this.pasajeros.length + 1 + '',
      nombre,
      apellido,
      edad,
      sexo,
      imagen,
      direccion
    })
  }

  deletePasajero(id: string) {
    this.pasajeros = this.pasajeros.filter(pasajero => {
      return pasajero.id !== id;
    }
    );
  }

}
