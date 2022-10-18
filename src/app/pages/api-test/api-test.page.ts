import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.page.html',
  styleUrls: ['./api-test.page.scss'],
})
export class ApiTestPage implements OnInit {

  constructor(private apiService : ApiService) { }

  ngOnInit() {
  }

  loadData() {
    this.apiService.getSedes().subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
