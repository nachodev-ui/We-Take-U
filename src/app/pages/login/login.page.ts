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
        this.getUserData(res.uid);

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
      header: 'Usuario no autenticado',
      message: 'Por favor, visite su direccion de correo electrónico para verificar su cuenta.',
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

        this.router.navigate(['interfaz/pasajero']);

      } else {
        this.usuarioNoVerificado();
      }

    }).catch((error) => {

      console.log(error);

      this.toastr.error(this.errorCode.stringError(error.code), 'Error');

      /* this.alertCtrl.create({
        mode: 'ios',
        header: 'Error',
        message: this.errorCode.stringError(error.code),
        buttons: ['OK']
      }).then(alert => alert.present()); */

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

