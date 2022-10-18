import { Injectable } from '@angular/core';
import { Slide } from './home';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private slides = [
    {
      img: 'assets/img/gpslocation.png',
      titulo: 'La dirección que necesitas en un solo click',
    },
    {
      img: 'assets/img/vehicle.webp',
      titulo: 'Vehículos disponibles para todo el establecimiento',
    },
    {
      img: 'assets/img/university.jpg',
      titulo: 'Una aplicación para tu universidad',
    }
  ]

  constructor() { }

  getSlides() {
    return [...this.slides]
  }


}
