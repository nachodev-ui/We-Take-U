import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LanguagesService } from 'src/app/services/languages.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registro-conductor',
  templateUrl: './registro-conductor.page.html',
  styleUrls: ['./registro-conductor.page.scss'],
})
export class RegistroConductorPage implements OnInit {

  formConductor: FormGroup;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private auth: AuthService,
    private database: FirebaseService,
    private builder: FormBuilder,
    private languageService: LanguagesService,
    private translate: TranslateService,
  ) {

    this.initializeApp();

    this.formConductor = this.builder.group({
      nombre: [''],
      apellido: [''],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      uid: [''],
      password: ['', Validators.required],
      password2: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(9), Validators.required])],
      direccion: [''],
      photoURL: ['https://ajisenramenpanama.com/wp-content/uploads/2020/07/user_icon.png'],
      perfil: 'Conductor',
      vehiculo: {
        patente: [''],
        marca: [''],
        modelo: [''],
        color: [''],
        capacidad: ['']
      },
    }, {
      validator: this.Mustmatch('password', 'password2')
    });
  }

  initializeApp() {
    this.languageService.setInitialAppLanguage();
  }

  ngOnInit() {
  }

  get rf() {
    return this.formConductor.controls;
  }

  Mustmatch(password: any, password2: any) {
    return (formGroup: FormGroup) => {

      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[password2];

      if (matchingControl.errors && !matchingControl.errors['Mustmatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ Mustmatch: true });
      } else {
        matchingControl.setErrors(null);
      }

    };
  }

  async loadingRegister() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: this.translate.instant('D_REGISTER.LOADING.message'),
      duration: 300,
    });
    await loading.present();
  }

  async voidForm() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Registro fallido',
      message: 'Por favor, complete todos los campos.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async valideIfEmailAlreadyExists() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('D_REGISTER.EMEXISTS.header'),
      message: this.translate.instant('D_REGISTER.EMEXISTS.message'),
      buttons: [
        {
          text: this.translate.instant('D_REGISTER.EMEXISTS.btnCancel'),
          handler: () => {
            this.intentaConOtroEmail();
          }
        },
        {
          text: this.translate.instant('D_REGISTER.EMEXISTS.btnRecover'),
          handler: () => {
            this.router.navigate(['reset-password']);
          }
        }
      ],
    });

    await alert.present();
  }

  async intentaConOtroEmail() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('D_REGISTER.OTHEREM.header'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async EmailOrPasswordAreNotValid() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Registro fallido',
      message: 'El correo o la contraseña no son válidos, por favor, intente de nuevo',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async passwordsAreNotEqual() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Registro fallido',
      message: 'Las contraseñas no coinciden, por favor, intente nuevamente',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async registrarConductor() {

    if (this.formConductor.value.password === this.formConductor.value.password2) {

      if (this.formConductor.value.nombre !== '' && this.formConductor.value.apellido !== '' && this.formConductor.value.email !== '' && this.formConductor.value.password !== '' && this.formConductor.value.password2 !== '' && this.formConductor.value.celular !== '') {

        this.loadingRegister();

        const validForm = await this.auth.registerUser(this.formConductor.value.email, this.formConductor.value.password).catch(res => {
        });

        if (validForm) {

          const path = 'Usuarios';
          const id = validForm.user.uid;

          this.formConductor.value.uid = id;
          this.formConductor.value.password = null;
          this.formConductor.value.password2 = null;

          this.database.createDoc(this.formConductor.value, path, id);

          this.registerSuccess();

          this.auth.accountVerification();

        } else {
          this.valideIfEmailAlreadyExists();
        }
      } else {
        this.voidForm();
      }
    } else {
      this.passwordsAreNotEqual();
    }

  }

  async registerSuccess() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('D_REGISTER.SUCREGISTER.header'),
      message: this.translate.instant('D_REGISTER.SUCREGISTER.message'),
      buttons: ['OK'],
    });

    alert.present();

    this.router.navigateByUrl('verificate');
  }

}
