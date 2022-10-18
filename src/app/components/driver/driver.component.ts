import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
})
export class DriverComponent implements OnInit {

  @Input() driver;

  constructor() { }

  ngOnInit() {}

  getData(datos) {
    return this.driver.datos;
  }

}
