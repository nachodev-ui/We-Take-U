import { Component, NgZone, OnInit, ViewChild } from '@angular/core';

import { AlertController } from '@ionic/angular';

import { } from 'googlemaps';

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
    private ngZone: NgZone
  ) { }

  async ngOnInit() {
    await this.loadMap();
  }

  async loadMap() {
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
        });
      }
    });

  }

  handleAddressChange(event: any) {
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

}
