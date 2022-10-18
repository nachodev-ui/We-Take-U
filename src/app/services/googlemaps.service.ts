import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  constructor() { }


  getMarkers() {
    return [
      {
        position: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        title: 'Marker 1'
      },
      {
        position: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        title: 'Marker 2'
      },
      {
        position: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        title: 'Marker 3'
      }
    ];
  }

}
