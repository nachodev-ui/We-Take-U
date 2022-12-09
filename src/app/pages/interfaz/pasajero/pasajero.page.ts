import { AfterContentChecked, Component, OnInit } from '@angular/core';

import { AlertController, ModalController } from '@ionic/angular';

import { PasajeroModalComponent } from '../../pasajero-modal/pasajero-modal.component';

import { FirebaseService } from 'src/app/services/firebase.service';

import SwiperCore, { Autoplay, SwiperOptions } from 'swiper';

import { UserI } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-pasajero',
  templateUrl: './pasajero.page.html',
  styleUrls: ['./pasajero.page.scss'],
})
export class PasajeroPage implements OnInit, AfterContentChecked {

  // Variable vacia que recibe el Service
  pasajeros = [];
  conductores = [];

  // Configuración del Swiper
  drivers: any[] = [];
  driversConfig: SwiperOptions;

  /*Inicializar el uid como null*/
  uid: string = null;

  /*Variable para desplegar info*/
  infoUser: UserI = null;

  constructor(
    private modalCtrl: ModalController,
    private database: FirebaseService,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {

    this.authService.stateUser().subscribe( res => {
      console.log('User', res);
      this.getUid();
    });

    /* PASAJERO TYPESCRIPT */
    this.drivers = [
      {
        id: '1',
        name: 'Ignacio',
        apellido: 'Cisternas',
        cover: 'assets/img/slayer_icon.jpg',
        datos: [
          'Sexo: Masculino',
          ' Edad: 20'
        ],
        rating: 5,
        price: 3000,
        car: 'Citroen C3',
        year: 2019,
        color: 'Rojo',
        plate: 'ABC-123',
        seats: 4,
        luggage: 2
      },
      {
        id: '2',
        name: 'Yerson',
        apellido: 'Gonzalez',
        cover: 'assets/img/noelle_icon.jpg',
        datos: [
          'Sexo: Masculino',
          ' Edad: 21'
        ],
        rating: 4,
        price: 3590,
        car: 'Ford Fiesta',
        year: 2017,
        color: 'Negro',
        plate: 'DEF-456',
        seats: 6,
        luggage: 4
      },
      {
        id: '3',
        name: 'Maria',
        apellido: 'Contreras',
        cover: 'assets/img/mine_icon.jpg',
        datos: [
          'Sexo: Femenino',
          ' Edad: 28'
        ],
        rating: 3,
        price: 5000,
        car: 'Audi',
        year: 2022,
        color: 'Azul',
        plate: 'GHI-789',
        seats: 4,
        luggage: 1
      }
    ];
  }

  async getUid() {
    const uid = await this.authService.getUid();

    if (uid) {
      this.uid = uid;
      console.log('UID', this.uid);
      this.getInfoUser();
    } else {
      this.uid = null;
    }
  }

  ngAfterContentChecked() {
    this.driversConfig = {
      slidesPerView: 1,
      centeredSlides: true,
    };
  }

  //Slide from Passengers UI
  option = {
    slidesPerView: 1.5,
    spaceBetween: 10,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 4000,
    }
  }

  async modalUser() {
    console.log('Open modal...');
    const modal = await this.modalCtrl.create({
      component: PasajeroModalComponent
    });

    await modal.present();
  }

  //Deployment data from Passengers view
  getInfoUser() {
    const path = 'Usuarios';
    const id = this.uid;

    this.database.getDoc<UserI>(path, id).subscribe( credentials => {
      if (credentials) {
        this.infoUser = credentials;
      }
    });

  }

  async getUserTrip() {
    const path = 'Viajes';
    const id = this.uid;

    this.database.getDoc<UserI>(path, id).subscribe( credentials => {
      if (credentials) {
        this.infoUser = credentials;
      }
    });
  }

  availableTrips() {
    this.router.navigateByUrl('routes');
  }


}
