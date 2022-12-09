import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserI } from 'src/app/models/models';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.page.html',
  styleUrls: ['./api-test.page.scss'],
})
export class ApiTestPage implements OnInit {

  users: any = [];

  infoUser: UserI = null;
  rol: 'Pasajero' | 'Conductor' | 'Administrador';
  role: any;

  constructor(
    private authService: AuthService,
    private fireService: FirebaseService,
    private router: Router,
    private actRoute: ActivatedRoute,
    ) {

    this.authService.stateUser().subscribe( res => {
      if (res) {

        /*Datos Pasajeros*/
        this.getUserData(res.uid);

      }
    });
   }

  ngOnInit() {
    this.getCollectionUser();
  }

  getUserData(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.fireService.getDoc<UserI>(path, id).subscribe( res => {
      console.log('Usuario ->', res);
      if (res) {
        this.infoUser = res;
        this.rol = res.perfil;
      }
    });
  }

  // Get collection user with rol === 'Pasajero'
  getCollectionUser() {
    const path = 'Usuarios';

    this.fireService.getCollection<UserI>(path).subscribe( users => {

      this.users = users.filter( user => user.perfil === 'Pasajero');

    });

  }

  // Navigate by id
  viajeDetailId(id: string) {
    this.router.navigate(['detalle-viaje/', id], {relativeTo: this.actRoute});
  }

  navToRoutes() {
    this.router.navigateByUrl('googlemaps');
  }

}

