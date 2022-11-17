import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';

import { } from 'googlemaps';

import { UserI, ViajeI } from 'src/app/models/models';

import { User } from '@angular/fire/auth';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.page.html',
  styleUrls: ['./googlemaps.page.scss'],
})

export class GooglemapsPage implements OnInit, OnDestroy {

  uid : string = null;
  infoUser: UserI = null;
  rol: 'Pasajero' | 'Conductor' | 'Administrador';

  authUser: User;
  authUserSub: Subscription;

  locationUpdateDoc = 'K8gg7mv2ITaRwZLGS9tw';
  locationUpdatesCollection = 'location-updates';
  driverId = '5i853iMMr7Rm63B1DlDwusV1io23';
  recipientId = 'RCQUcURkT9VUvmVK20Cqiwiv8Mv2';
  locSimulationInterval: any;

  showMapPill: boolean;
  mapLoaded: boolean;
  map: google.maps.Map;
  center: google.maps.LatLngLiteral;

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;

  sourcePin: google.maps.Marker;
  destinationPin: google.maps.Marker;
  locationWatchId: number;

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
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private dbFire: FirebaseService,
    private afs: AngularFirestore,
  ) {
    this.authService.stateUser().subscribe( credentials => {
      if(credentials) {
        /*Datos Pasajeros*/
        this.loadUserData(credentials.uid);
      }
    });
  }

  async ngOnInit() {

    this.authUserSub = this.authService.stateUser().subscribe((user: User) => {
      this.authUser = user;
    });

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
          anchor: new google.maps.Point(40,20),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(40, 40)
        },
        map: this.map
      });

      this.map.addListener('click', (event: any) => {
          this.showMapPill = false;
      });

    });

    this.locationWatchId = navigator.geolocation.watchPosition(
      (position) => {

        // if its the driver user that's logged in,
        // then update its location as he / she moves

        if (this.infoUser.uid === this.driverId) {

          this.source = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (this.sourcePin) {
            this.sourcePin.setPosition(this.source);
          }

          // broadcast my location to
          // interest client via firebase
          this.afs.collection(this.locationUpdatesCollection)
          .doc(this.locationUpdateDoc)
          .set({
            source: {
              location: {
                lat: this.source.lat,
                lng: this.source.lng
              },
              uid: this.infoUser.uid
            }
          }, { merge: true });
        }
      },
      (error) => {
        console.log(error);
      }
    );

    // listen for updates on locationUpdateDoc
    // and update the map accordingly
    this.afs.collection(this.locationUpdatesCollection)
    .doc(this.locationUpdateDoc)
    .valueChanges()
    .subscribe((data: any) => {

        if (data.destination && data.destination.uid === this.infoUser.uid) {

          this.dr.setOptions({
            map: this.map,
            suppressPolylines: false,
          });

          // set route information once

          // update source (driver location)

        }
      });

  }

  async loading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando',
      duration: 1200
    });
    await loading.present();
  }

  async journeyReady() {
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

  async journeyDeclined() {
    const alert = await this.alertCtrl.create({
      header: 'Cancelar',
      message: '¿Desea cancelar el viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });
    await alert.present();
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

        // let's do a simulation...
        if (this.infoUser.uid === this.driverId) {

          // upload the route information to firebase so receiving user
          // get it as well and avoid having to make a call in the
          // Directions API

          let latLngs = [];
          let step: any = response.routes[0].legs[0].steps[0];
          step.lat_lngs.forEach((stepPoint) => {
            latLngs.push({
              lat: stepPoint.lat(),
              lng: stepPoint.lng()
            });
          });

          // upload my location after getting it
          // from the Google Places API
          this.afs
          .collection(this.locationUpdatesCollection)
          .doc(this.locationUpdateDoc)
          .set({
            source: {
              route: JSON.stringify(response),
              location : {
                lat: this.source.lat,
                lng: this.source.lng
              },
              uid: this.infoUser.uid
            }
          }, { merge: true });

          let count = 0;
          this.locSimulationInterval = setInterval(() => {
            if (count < latLngs.length) {
              let currentPos = latLngs[count];

              this.afs
              .collection(this.locationUpdatesCollection)
              .doc(this.locationUpdateDoc)
              .set({
                source: {
                  location: {
                    lat: currentPos.lat,
                    lng: currentPos.lng
                  },
                  uid: this.infoUser.uid
                }
              }, { merge: true });
              count++;

              this.source = currentPos;
              this.setupSourcePin();
            }
          }, 1000);

        }

        this.ngZone.run(() => {
          let distanceInfo = response.routes[0].legs[0];
          this.distance = distanceInfo.distance.text;
          this.time = distanceInfo.duration.text;
          this.generateViajeDetails();
          this.saveViajeDetailsInUser();
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

    this.setupSourcePin();
    this.setRoutePolyne();
  }

  setupSourcePin() {
    if (!this.sourcePin) {
      // adding a marker
      this.sourcePin = new google.maps.Marker({
        position: this.source,
        icon: {
          url: './assets/img/marker.png',
          anchor: new google.maps.Point(40,20),
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(40, 40)
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
    pasajero: [{}],
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
      pasajero: [
        {
          nombre: this.infoUser.nombre,
          apellido: this.infoUser.apellido,
          celular: this.infoUser.celular,
          email: this.infoUser.email,
        }
      ],
      estado: 'En curso',
      uid: ''
    }

    return viajeDetails;

  }

  loadUserData(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.dbFire.getDoc<UserI>(path, id).subscribe( credentials => {
      if (credentials) {
        this.infoUser = credentials;
      } else {
        console.log('No existe el usuario');
      }
    });
  }

  //calcular precio a partir de origen y destino
  calculatePrice() {
    let price = '0';
    let distance = this.distance;
    let distanceNumber = distance.split(' ');
    let distanceNumberFloat = parseFloat(distanceNumber[0]);
    if (distanceNumberFloat <= 5) {
      price = '3.000';
    } else if (distanceNumberFloat > 5 && distanceNumberFloat <= 10) {
      price = '6.500';
    } else if (distanceNumberFloat > 10 && distanceNumberFloat <= 15) {
      price = '10.000';
    } else if (distanceNumberFloat > 15 && distanceNumberFloat <= 20) {
      price = '15.000';
    } else if (distanceNumberFloat > 20 && distanceNumberFloat <= 25) {
      price = '20.000';
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

  ngOnDestroy(): void {
    this.authUserSub.unsubscribe();
    navigator.geolocation.clearWatch(this.locationWatchId);
    clearInterval(this.locSimulationInterval);
  }

}
