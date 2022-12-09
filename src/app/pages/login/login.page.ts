import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AlertController, LoadingController, NavController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

import { UserI } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LanguagesService } from 'src/app/services/languages.service';
import { TranslateService } from '@ngx-translate/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CodeErrorService } from 'src/app/services/code-error.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  infoUser: UserI = null;

  loged = false;

  /*Rol menu*/
  rol: 'Pasajero' | 'Conductor';

  constructor(
    private router: Router,
    public builder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private database: FirebaseService,
    private languageService: LanguagesService,
    private translate: TranslateService,
    private afAuth: AngularFireAuth,
    private errorCode: CodeErrorService,
    private toastr: ToastrService
    ) {

    this.initializeApp();

    /* Validaciones para un formulario */
    this.formularioLogin = this.builder.group
    ({
      'email': new FormControl('', Validators.compose([Validators.email, Validators.required])),
      'password': new FormControl('', Validators.required),
    });

    this.auth.stateUser().subscribe( res => {
      if(res) {
        this.loged = true;

        /*Datos Pasajeros*/
        this.assignProfile(res.uid);

        this.userProfile(res.uid);

      } else {
        this.loged = false;
      }
    });

  }

  initializeApp() {
    this.languageService.setInitialAppLanguage();
  }

  ngOnInit() {
  }

  backToHome() {
    this.router.navigate(['home']);
  }

  signUp() {
    this.router.navigate(['registro']);
  }

  resetPass() {
    this.router.navigate(['reset-password']);
  }

  assignProfile(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.database.getDoc<UserI>(path, id).subscribe( res => {
      if (res) {
        this.rol = res.perfil;
      }
    });
  }

  userProfile(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.database.getDoc<UserI>(path, id).subscribe( res => {
      if (res) {
        this.infoUser = res;
      }
    });
  }

  async openLoading() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: this.translate.instant('LOGIN.LOADING.message'),
      duration: 100
    });
    return await loading.present();
  }

  async closeLoading() {
    return await this.loadingCtrl.dismiss();
  }

  async camposVacios() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('LOGIN.VACIO.header'),
      message: this.translate.instant('LOGIN.VACIO.message'),
      buttons: ['OK']
    });

    await alert.present();
  }

  async emailNoRegistrado() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('LOGIN.NEXISTE.header'),
      message: this.translate.instant('LOGIN.NEXISTE.message'),
      buttons: ['OK']
    });

    await alert.present();
  }

  async usuarioNoVerificado() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('LOGIN.FAUTHENTICATED.header'),
      message: this.translate.instant('LOGIN.FAUTHENTICATED.message'),
      buttons: ['OK']
    });

    await alert.present();
  }

  async login() {

    const email = this.formularioLogin.value.email;
    const password = this.formularioLogin.value.password;

    await this.openLoading();

    this.afAuth.signInWithEmailAndPassword(email, password).then((user ) => {
      if (user.user.emailVerified) {

          if (this.rol === 'Pasajero') {

            setTimeout(() => {
              this.router.navigate(['interfaz/pasajero']);
            }, 1000);

          } else if (this.rol === 'Conductor') {

            setTimeout(async () => {

              const arrayVeh = this.infoUser.vehiculo
              const arrayVeh2 = Object.values(arrayVeh.patente);

              if (arrayVeh2.length === 1) {
                console.log('No existe ningún vehículo en el usuario');
                this.router.navigate(['info-vehiculo']);
              }

              if (arrayVeh2.length > 1) {
                console.log('El usuario ya contiene vehículo');
                this.router.navigate(['interfaz/conductor']);
              }
            }, 1000);
          }

      } else {
        this.usuarioNoVerificado();
      }
    }).catch((error) => {
      this.toastr.error(this.errorCode.stringError(error.code), 'Error');
    });

  }

  async googleLogin() {
    await this.openLoading();

    this.auth.googleLogin().then( async () => {
      this.router.navigate(['interfaz/pasajero']);
    }
    ).catch( async err => {
      console.log('Error de sistema', err);
    });

  }

  async githubLogin() {
    await this.openLoading();

    const validForm = await this.auth.githubLogin().catch( async err => {
      console.log(err);

    });

    if (validForm) {
      this.router.navigate(['interfaz/pasajero']);
    }

  }

}

