import { Component, OnInit } from '@angular/core';

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


  constructor(
  ) { }

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true,
    });

    navigator.geolocation.getCurrentPosition((position) => {

      this.source = {
        lat: -33.6008171,
        lng: -70.5801337
      }

      this.destination = {
        lat: -33.6241285,
        lng: -70.5786753
      }

      //Initialize the map container
      this.map = new google.maps.Map(document.getElementById('map'), {
        ...this.options,
        center: this.source
      });

      //Adding the marker to the map
      var markerStart = new google.maps.Marker({
        position: this.source,
        icon: {
          url: 'assets/img/marker.png',
          anchor: new google.maps.Point(35, 10),
          scaledSize: new google.maps.Size(40, 40),
        },
        map: this.map
      });

      markerStart.addListener('click', (event: any) => {
        this.showMapPill = true;
        this.onCenterMap();
      });

      var destinationMarker = new google.maps.Marker({
        position: this.destination,
        icon: {
          url: 'assets/img/marker.png',
          anchor: new google.maps.Point(35, 10),
          scaledSize: new google.maps.Size(40, 40),
        },
        map: this.map
      });

      this.onCenterMap();
      this.setRoutePolyne();

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

        let distanceInfo = response.routes[0].legs[0];
        this.distance = distanceInfo.distance.text;
        this.time = distanceInfo.duration.text;
      }
    });

  }

  onCenterMap() {
    this.map.setCenter(this.source);
  }


}
