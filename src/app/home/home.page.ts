import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
    ) {}

  //Obtenemos los slides del servicio
  ngOnInit() {
    this.slides = this.servicio.getSlides();
  }

}
