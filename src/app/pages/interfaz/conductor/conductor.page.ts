import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {

  actualDay = this.getDayDate();

  constructor(

    ) { }

  ngOnInit() {
  }

  getDayDate() {
    var date = new Date();
    var month = date.toLocaleDateString('es-CL', { month: 'long' });
    var dayNum = date.toLocaleDateString('es-CL', { day: 'numeric' });

    return dayNum + ' de ' + month.charAt(0).toUpperCase() + month.slice(1);
  }

  loadSedes() {
    //
  }

}
