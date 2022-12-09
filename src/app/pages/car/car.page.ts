import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserI } from 'src/app/models/models';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
})
export class CarPage implements OnInit {

  uid: string = null;
  infoUser: UserI = null;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) {
    this.authService.stateUser().subscribe( data => {
      if(data) {

        this.driverCredentials(data.uid);

      } else {

        this.router.navigateByUrl('login');

      }
    })
   }

  ngOnInit() {

  }

  driverCredentials(uid: string) {
    const path = 'Usuarios';
    const id = uid;

    this.firebaseService.getDoc<UserI>(path, id).subscribe( credentials => {

      if (credentials) {

        this.infoUser = credentials;
        console.log('Driver credentials => ', this.infoUser);


      } else {

        this.router.navigateByUrl('login');

      }
    });
  }

}
