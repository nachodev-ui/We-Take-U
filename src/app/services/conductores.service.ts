import { Injectable } from '@angular/core';

import { Conductor } from '../pages/interfaz/conductor/conductor';

@Injectable({
  providedIn: 'root'
})
export class ConductoresService {

  private conductores :  Conductor[] = [
    {
      id: '1',
      name: 'Darling',
      apellido: 'Díaz',
      cover: 'assets/img/ruby_icon.jpg',
      datos: [
        'Sexo: Femenino',
        ' Edad: 25'
      ],
      rating: 5,
      valor: '4.590',
      car: 'Citroen C3',
      year: 2019,
      color: 'Rojo',
      plate: 'ABC-123',
      seats: 4,
      luggage: 2
    },
    {
        id: '2',
        name: 'Yerson',
        apellido: 'Gonzalez',
        cover: 'assets/img/noelle_icon.jpg',
        datos: [
          'Sexo: Masculino',
          ' Edad: 21'
        ],
        rating: 4,
        valor: '4.290',
        car: 'Ford Fiesta',
        year: 2017,
        color: 'Negro',
        plate: 'DEF-456',
        seats: 6,
        luggage: 4
    },
    {
      id: '3',
      name: 'Maria',
      apellido: 'Contreras',
      cover: 'assets/img/mine_icon.jpg',
      datos: [
        'Sexo: Masculino',
        ' Edad: 28'
      ],
      rating: 3,
      valor: '4.190',
      car: 'Audi',
      year: 2022,
      color: 'Azul',
      plate: 'GHI-789',
      seats: 4,
      luggage: 1
    }
  ]

  constructor() { }

  getConductores() {
    return [...this.conductores];
  }

  getConductor(id: string) {
    return {...this.conductores.find(conductor => conductor.id === id)};
  }

  addConductor(name: string, apellido: string, cover: string, datos: string[], rating: number, valor: string, car: string, year: number, color: string, plate: string, seats: number) {
    this.conductores.push({
      id: this.conductores.length + 1 + '',
      name,
      apellido,
      cover,
      datos,
      rating,
      valor,
      car,
      year,
      color,
      plate,
      seats,
      luggage: 1
    });
  }

  deleteConductor(id: string) {
    this.conductores = this.conductores.filter(conductor => conductor.id !== id);
  }

}
