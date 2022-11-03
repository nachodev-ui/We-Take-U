import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserI } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-verificate',
  templateUrl: './verificate.page.html',
  styleUrls: ['./verificate.page.scss'],
})
export class VerificatePage implements OnInit {

  infoUser: UserI = null;

  loged = false;

  /*Rol menu*/
  rol: 'Pasajero' | 'Conductor';

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private database: FirebaseService,
    private auth: AuthService,
    private translate: TranslateService
  ) {
    this.auth.stateUser().subscribe( res => {
      if(res) {
        this.loged = true;

        /*Datos Pasajeros*/
        this.getUserData(res.uid);

      } else {
        this.loged = false;
      }
    });
  }

  ngOnInit() {
    this.dissapearButton();
  }

  ionViewDidEnter() {
    this.appearButton();
  }

  dissapearButton() {
    document.getElementById('btn-vef').style.display = 'none';
  }

  appearButton() {
    setTimeout(() => {
      document.getElementById('btn-vef').style.display = 'block';
    }, 7000);
  }

  async verifing() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: this.translate.instant('VERIFICATE.VLOADING.message'),
      spinner: 'bubbles',
      duration: 1000
    });
    await loading.present();
  }

  async loadingRedirect() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: this.translate.instant('VERIFICATE.VLOADING.message'),
      spinner: 'bubbles',
      duration: 1000
    });
    await loading.present();
  }

  async redirectToFinal() {

    await this.loadingRedirect();

    if (this.rol === 'Pasajero') {

      setTimeout(() => {
        this.router.navigate(['interfaz/pasajero']);
      }, 1000);

    } else if (this.rol === 'Conductor') {

      setTimeout(async () => {

        this.router.navigate(['info-vehiculo']);

      }, 1000);
    }

  }

  getUserData(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.database.getDoc<UserI>(path, id).subscribe( res => {
      console.log('datos ->', res);
      if (res) {
        this.rol = res.perfil;
      }
    });
  }

}
