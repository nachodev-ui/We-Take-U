import { Component } from '@angular/core';

import { LanguagesService } from '../services/languages.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Variable vacia que recibe el Service
  slides = [];

  constructor(
    private servicio: HomeService,
    private languageService: LanguagesService
    ) {
      this.initializeApp();
    }

  initializeApp() {
    this.languageService.setInitialAppLanguage();
  }

  //Obtenemos los slides del servicio
  ngOnInit() {
    this.slides = this.servicio.getSlides();
  }

}
