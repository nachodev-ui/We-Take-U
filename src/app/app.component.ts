import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AlertController, Platform, PopoverController } from '@ionic/angular';

import { Storage } from '@ionic/storage-angular';

import { ConductorI, UserI, ViajeI } from './models/models';

import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
import { TranslateService } from '@ngx-translate/core';

import { LanguagePopoverPage } from './pages/language-popover/language-popover.page';
import { LanguagesService } from './services/languages.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  uid: string = null;
  infoUser: UserI = null;

  infoViaje: ViajeI = null;

  /*Antes de loguear, logged = false*/
  /*Controlar la vista*/
  login = false;

  /*Rol menu*/
  rol: 'Pasajero' | 'Conductor' | 'Administrador';

  constructor(
    private router: Router,
    private platform: Platform,
    private alertCtrl: AlertController,
    private auth: AuthService,
    private database: FirebaseService,
    private translate: TranslateService,
    private popoverCtrl: PopoverController,
    private languageService: LanguagesService,
    private storage: Storage
    ) {

    this.initializeApp();

    this.auth.stateUser().subscribe( res => {
      if(res) {
        console.log('User is logged in');
        this.login = true;

        /*Datos Pasajeros*/
        this.getUserData(res.uid);

        /*Datos Conductor*/
        this.getConductorData(res.uid);

        /*Datos viaje*/
        this.getViajeData(res.uid);

      } else {
        console.log('User is not loggin');
        this.login = false;
      }
    });

  }

  /*La APP se inicializa*/
  initializeApp() {
    this.platform.ready().then(() => {

      this.router.navigateByUrl('login');

      this.languageService.setInitialAppLanguage();

    });
  }

  async ngOnInit() {

    await this.storage.create();

    this.auth.stateUser().subscribe( res => {
      this.getUid();
    });
  }

  async autoHideAfterSelectLng() {
    const menu = document.querySelector('ion-menu');

    setTimeout(async () => {
      await menu.close();
    }, 2200);
  }

  async openLanguagePopover(ev: any) {
    await this.popoverCtrl.create({
      component: LanguagePopoverPage,
      event: ev,
      //translucent: true
    }).then(popover => popover.present());
  }

  async popoverAlert() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('ALERT.header'),
      message: this.translate.instant('ALERT.message'),
      buttons: ['OK']
    });
    alert.present();
  }

  async getUid() {
    const uid = await this.auth.getUid();

    if (uid) {
      this.uid = uid;

      this.getInfoUser();

    } else {
      this.uid = null;
    }
  }

  /*Alerta de sesion cerrada*/
  async exitSessionSuccess() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Sesión Cerrada',
      message: 'Sesión cerrada correctamente',
      buttons: [
        {
          text: 'Aceptar',
        }
      ]
    });

    await alert.present();
  }

  /*Alerta de cancelar el cierre de sesion*/
  async exitSessionCanceled() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Sesión no cerrada',
      message: 'Puede continuar navegando en la aplicación',
      buttons: [
        {
          text: 'Navegar',
        }
      ]
    });

    await alert.present();
  }

  /*Incluir las anteriores alerta y el metodo de logout desde firebase*/
  async exitSession() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.exitSessionCanceled();
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.exitSessionSuccess();
            this.router.navigate(['/home']);
            this.auth.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  getUserData(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.database.getDoc<UserI>(path, id).subscribe( res => {

      if (res) {
        this.rol = res.perfil;
      } else {
        this.rol = null;
      }

    });
  }

  /*Tomar los datos del usuario autenticado*/
  getInfoUser() {
    const path = 'Usuarios';
    const id = this.uid;

    this.database.getDoc<UserI>(path, id).subscribe( credentials => {

      if (credentials) {

        this.infoUser = credentials;

      } else {
        this.infoUser = null;
      }
    });

  }

  getConductorData(uid: string) {
    const path = 'Conductores';
    const id = uid;

    this.database.getDoc<ConductorI>(path, id).subscribe( res => {

      if (res) {
        this.rol = res.perfil;
      }
    });
  }

  getViajeData(uid: string) {
    const path = 'Viajes';
    const id =  uid;
    this.database.getDoc<ViajeI>(path, id).subscribe( viaje => {

      if (viaje) {
        this.infoViaje = viaje;
      }

    });
  }

  logout() {
    this.exitSession();
  }

  test() {
    this.router.navigate(['test-blob']);
  }

}
