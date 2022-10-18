import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

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
    private builder: FormBuilder
  ) {
    this.formConductor = this.builder.group({
      nombre: [''],
      apellido: [''],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      uid: [''],
      password: ['', Validators.required],
      password2: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      direccion: [''],
      imagen: ['https://ajisenramenpanama.com/wp-content/uploads/2020/07/user_icon.png'],
      perfil: 'Conductor',
    });
  }

  ngOnInit() {
  }

  async intentaConOtroEmail() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Muy bien, intenta con otro email',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async valideIfEmailAlreadyExists() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: '¿Ya tienes una cuenta?',
      message: 'El correo que ingresas se encuentra uso, quizá hayas olvidado tu contraseña',
      buttons: [
        {
          text: 'No tengo cuenta',
          handler: () => {
            this.intentaConOtroEmail();
          }
        },
        {
          text: 'Restablecer contraseña',
          handler: () => {
            this.router.navigate(['reset-password']);
          }
        }
      ],
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

  async loadingRegister() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Registrando...',
      duration: 300,
    });
    await loading.present();
  }

  async registerSuccess() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Registro exitoso',
      message: 'Para continuar, permitenos conocer más sobre tu medio de transporte',
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

  async voidForm() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Registro fallido',
      message: 'Por favor, complete todos los campos',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async registrarConductor() {

    if (this.formConductor.value.password === this.formConductor.value.password2) {

      if (this.formConductor.value.nombre !== '' && this.formConductor.value.apellido !== '' && this.formConductor.value.email !== '' && this.formConductor.value.password !== '' && this.formConductor.value.password2 !== '' && this.formConductor.value.celular !== '') {

        this.loadingRegister();

        const validForm = await this.auth.registerUser(this.formConductor.value.email, this.formConductor.value.password).catch(res => {
          this.EmailOrPasswordAreNotValid();
        });

        if (validForm) {

          const path = 'Usuarios';
          const id = validForm.user.uid;

          this.formConductor.value.uid = id;

          this.database.createDoc(this.formConductor.value, path, id);

          setTimeout(() => {
            this.registerSuccess();
            this.router.navigate(['info-vehiculo']);
          }, 2300);

        } else {
          this.valideIfEmailAlreadyExists();
        }
      } else {
        this.voidForm();
      }
    } else {
      this.passwordsAreNotEqual();
    }

    setTimeout(() => {
      this.router.navigate(['/verificate-conductor']);
    });

  }

}
