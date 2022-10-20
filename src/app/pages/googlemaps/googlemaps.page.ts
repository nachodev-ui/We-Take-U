import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { } from 'googlemaps';
import { ViajeI } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.page.html',
  styleUrls: ['./googlemaps.page.scss'],
})

export class GooglemapsPage implements OnInit {

  showMapPill: boolean;
  mapLoaded: boolean;
  map: google.maps.Map;
  center: google.maps.LatLngLiteral;

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;

  sourcePin: google.maps.Marker;
  destinationPin: google.maps.Marker;

  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    disableDefaultUI: true,
    disableDoubleClickZoom: false,
    zoom: 15
  }

  time: string = '';
  distance: string = '';

  ds: google.maps.DirectionsService;
  dr: google.maps.DirectionsRenderer;

  placesText: string;
  togglePlacesSearch: boolean = false;

  constructor(
    private ngZone: NgZone,
    private fire: FirebaseService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true,
    });

    navigator.geolocation.getCurrentPosition(position => {

      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.destination = this.center;

      //Initialize the map container
      this.map = new google.maps.Map(document.getElementById('map'), {
        ...this.options,
        center: this.destination
      });

      this.map.addListener('tilesloaded', () => {
        this.ngZone.run(() => {
          this.mapLoaded = true;

        });
      });

      this.destinationPin = new google.maps.Marker({
        position: this.destination,
        icon: {
          url: 'assets/img/marker.png',
          anchor: new google.maps.Point(35, 10),
          scaledSize: new google.maps.Size(30, 30),
        },
        map: this.map
      });

      this.map.addListener('click', (event: any) => {
          this.showMapPill = false;
      });

    });
  }

  async loading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando',
      duration: 1200
    });
    await loading.present();
  }

  async confirmNewViaje() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Desea confirmar el viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.saveViajeDetailsInUser();
          }
        }
      ]
    });
    await alert.present();

    this.loading();

    setTimeout(() => {
      this.router.navigateByUrl('interfaz/pasajero-viajes')
    }, 200);
  }

  setRoutePolyne() {
    let request = {
      origin: this.source,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.ds.route(request, (response, status ) => {
      this.dr.setOptions({
        suppressPolylines: false,
        map: this.map,
        suppressMarkers: true,
      });

      if (status == google.maps.DirectionsStatus.OK) {
        this.dr.setDirections(response);

        this.ngZone.run(() => {
          let distanceInfo = response.routes[0].legs[0];
          this.distance = distanceInfo.distance.text;
          this.time = distanceInfo.duration.text;
          this.generateViajeDetails();
        });
      }
    });

  }

  handleAddressChange(event: any) {
    //rescue geolocation data

    const lat = event.geometry.location.lat();
    const lng = event.geometry.location.lng();

    this.source = {
      lat: lat,
      lng: lng
    };

    if (!this.sourcePin) {
      // adding a marker
      this.sourcePin = new google.maps.Marker({
        position: this.source,
        icon: {
          url: './assets/img/marker.png',
          anchor: new google.maps.Point(35,10),
          scaledSize: new google.maps.Size(30, 30)
        },
        animation: google.maps.Animation.DROP,
        map: this.map
      });

      this.sourcePin.addListener("click", (event: any) => {
        this.showMapPill = true;
        this.onCenterMap();
      });
    }
    else {
      this.sourcePin.setPosition(this.source);
    }

    this.setRoutePolyne();
    
  }

  onCenterMap() {
    this.map.panTo(this.source);
  }

  viajeDetails: ViajeI = {
    destino: '',
    duracionViaje: '',
    fechaViaje: '',
    hora: '',
    precio: '',
    conductor: '',
    pasajero: '',
    estado: '',
    uid: ''
  }

  generateViajeDetails() {
    let viajeDetails: ViajeI = {
      destino: this.placesText,
      duracionViaje: this.time,
      fechaViaje: this.today(),
      hora: this.hours(),
      precio: this.calculatePrice(),
      conductor: '',
      pasajero: '',
      estado: '',
      uid: ''
    }
    return viajeDetails;

  }

  //calcular precio a partir de origen y destino
  calculatePrice() {
    let price = '0';
    let distance = this.distance;
    let distanceNumber = distance.split(' ');
    let distanceNumberFloat = parseFloat(distanceNumber[0]);
    if (distanceNumberFloat <= 5) {
      price = '5.000';
    } else if (distanceNumberFloat > 5 && distanceNumberFloat <= 10) {
      price = '10.000';
    } else if (distanceNumberFloat > 10 && distanceNumberFloat <= 15) {
      price = '15.000';
    } else if (distanceNumberFloat > 15 && distanceNumberFloat <= 20) {
      price = '20.000';
    } else if (distanceNumberFloat > 20 && distanceNumberFloat <= 25) {
      price = '25.000';
    } else if (distanceNumberFloat > 25 && distanceNumberFloat <= 30) {
      price = '30.000';
    }
    return price;
  }

  hours() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let time = `${hours}:${minutes}`;
    return time;
  }

  today() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let today = `${day}/${month}/${year}`;
    return today;
  }

  saveViajeDetailsInUser() {
    let viajeDetails = this.generateViajeDetails();
    this.fire.saveViajeDetails(viajeDetails);
  }

}
