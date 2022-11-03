import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private slides = [
    {
      img: '../assets/img/gpslocation.png',
      titulo: this.translate.instant('HOME.f_slide.title'),
      color: '#FFD700',
    },
    {
      img: '../assets/img/vehicle.webp',
      titulo: this.translate.instant('HOME.s_slide.title'),
      color: '#FFD700',
    },
    {
      img: '../assets/img/university.jpg',
      titulo: this.translate.instant('HOME.t_slide.title'),
      color: '#FFD700',
    }
  ];



  constructor(
    public translate: TranslateService
    ) { }


  getSlides() {
    return [...this.slides]
  }


}
